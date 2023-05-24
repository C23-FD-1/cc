import { createReadStream, writeFileSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import Papa from "papaparse";
import { IEncodedRow, IRow } from "../interfaces/row";
import * as tf from "@tensorflow/tfjs-node";
import path from "path";
import NormalizationParams from "../constants/normalization";
import IResult from "../interfaces/res";
import timestampConverter from "../helpers/timestampConverter";
import oneHotEncode from "../helpers/encoder";

export default class PredictService {
	private rows: IRow[] = [];
	private encodedRows: IEncodedRow[] = [];
	private input: number[][] = [];
	private params = new NormalizationParams();
	private result: IResult[] = [];
	public outName: string = "";
	private file;
	private is_scammer: number[] = [];

	constructor(dir: string) {
		this.file = createReadStream(dir);
	}

	public insert = () => {
		return new Promise<void>((resolve, reject) => {
			Papa.parse(this.file, {
				delimiter: ";",
				header: true,
				quoteChar: '"',
				worker: true,
				error: (err) => {
					reject(err);
				},
				complete: (res) => {
					this.rows = res.data as IRow[];
					resolve();
				},
			});
		});
	};

	public drop = () => {
		return new Promise<void>((resolve) => {
			this.rows = this.rows.map(({ uid, "": _, is_scammer, source, ...element }) => {
				this.is_scammer.push(is_scammer as number);
				this.result.push({
					uid: uid!,
				});

				return element;
			});
			resolve();
		});
	};

	public toTimestamp = () => {
		return new Promise<void>((resolve) => {
			this.rows = this.rows.map(({ trx_date, report_date, registereddate, birthday, ...element }) => {
				const trx_date_in_days = timestampConverter(trx_date as string);
				const report_date_in_days = timestampConverter(report_date as string);
				const registered_date_in_days = timestampConverter(registereddate as string);
				const birth_date_in_days = timestampConverter(birthday as string);

				const res = {
					trx_date: trx_date_in_days,
					report_date: report_date_in_days,
					registereddate: registered_date_in_days,
					birthday: birth_date_in_days,
					...element,
				};

				return res;
			});
			resolve();
		});
	};

	public hotEncode = () => {
		return new Promise<void>((resolve) => {
			this.encodedRows = this.rows.map(({ job_position, gender, source, ...element }) => {
				const [hashGender, hashJob] = oneHotEncode({ job_position, gender });

				const res: IEncodedRow = {
					...hashGender,
					...hashJob,
					...element,
				};
				return res;
			});
			resolve();
		});
	};

	public clip = () => {
		return new Promise<void>((resolve) => {
			this.encodedRows.forEach((item: any) => {
				const keys = Object.keys(item);

				keys.forEach((value) => {
					if (this.params.getKeys().includes(value)) {
						const minVal: number = this.params.getParams()[value]["min"];
						const maxVal: number = this.params.getParams()[value]["max"];

						item[value] =
							(item[value] as number) < this.params.getParams()[value]["min"]
								? this.params.getParams()[value]["min"]
								: (item[value] as number) > this.params.getParams()[value]["max"]
								? this.params.getParams()[value]["max"]
								: item[value];

						item[value] = Number(item[value] - minVal) / (maxVal - minVal);
					}
				});

				this.input.push([
					item.trx_date,
					item.report_date,
					item.registereddate,
					item.birthday,
					item.is_verified,
					item.aqc_freq_prepaid_mobile,
					item.aqc_mean_prepaid_mobile_amount,
					item.aqc_freq_topup,
					item.aqc_freq_topup_within_7d,
					item.aqc_mean_topup_amount,
					item.aqc_mean_topup_amount_7d,
					item.aqc_mean_topup_amount_30d,
					item.aqc_mean_topup_amount_90d,
					item.aqc_total_topup_amount_7d,
					item.aqc_total_topup_amount_90d,
					item.aqc_freq_x2x,
					item.aqc_freq_x2x_within_60d,
					item.aqc_freq_x2x_within_90d,
					item.aqc_mean_x2x_amount,
					item.aqc_mean_x2x_amount_7d,
					item.aqc_mean_x2x_amount_30d,
					item.aqc_mean_x2x_amount_60d,
					item.aqc_mean_x2x_amount_90d,
					item.aqc_total_x2x_amount,
					item.aqc_total_x2x_amount_7d,
					item.aqc_total_x2x_amount_30d,
					item.aqc_total_x2x_amount_60d,
					item.aqc_total_x2x_amount_90d,
					item.dormancy_max_gmt_pay_diff_days,
					item.dormancy_mean_gmt_pay_diff_days,
					item.dormancy_count_trx,
					item.kyc_total_failed,
					item.kyc_total_revoked,
					item.avg_topup_weight_1,
					item.avg_x2x_weight_1,
					item.avg_other_weight_1,
					item.centrality_outdegree_p2p,
					item.centrality_indegree_p2p,
					item.centrality_undirected_p2p,
					item.centrality_outdegree_sendmoney,
					item.gender_Female,
					item.gender_Male,
					item.gender_None,
					item.job_position_KARYAWAN,
					item.job_position_LAINNYA,
					item.job_position_PEGAWAI_NS,
					item.job_position_PELAJAR,
					item.job_position_RUMAH_TANGGA,
					item.job_position_SPESIALIS,
					item.job_position_TIDAK_KERJA,
					item.job_position_WIRASWASTA,
				]);
			});
			resolve();
		});
	};

	public consumeModel = () => {
		return new Promise<void>(async (resolve) => {
			const p = path.join(__dirname, "../../../models", "model.json");

			const model = await tf.loadLayersModel(`file://${p}`);

			const inputTensors = this.input.map((value) => tf.tensor(value).reshape([1, 51]));
			const inputTensor = tf.concat(inputTensors, 0);
			const outputTensor = model.predict(inputTensor) as tf.Tensor<tf.Rank>;

			const predictionValues = outputTensor.dataSync();

			tf.dispose(inputTensor);
			tf.dispose(outputTensor);

			this.result.forEach((result, index) => {
				result.predictScore = Number(predictionValues[index]);
				result.isScammer = Number(predictionValues[index]) > 0.5 ? 1 : 0;
			});

			resolve();
		});
	};

	public export = () => {
		return new Promise<void>((resolve) => {
			const csvContent = [
				["uid", "predictionScore", "isScammer"].join(","),
				...this.result.map((obj) => obj.uid + "," + obj.predictScore + "," + obj.isScammer),
			].join("\n");

			const outName = `${uuidv4()}.csv`;
			const exportPath = path.join(__dirname, "../../../public/out", outName);
			writeFileSync(exportPath, csvContent, "utf-8");

			this.outName = outName;

			resolve();
		});
	};
}
