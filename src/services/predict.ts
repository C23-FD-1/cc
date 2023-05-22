import { ReadStream, createReadStream, writeFileSync } from "fs";
import { v4 as uuidv4 } from "uuid";
import Papa from "papaparse";
import { IEncodedRow, IRow } from "../interfaces/row";
import * as tf from "@tensorflow/tfjs-node";
import path from "path";
import NormalizationParams from "../constants/normalization";
import IResult from "../interfaces/res";

export default class PredictService {
	private rows: IRow[] = [];
	private encodedRows: IEncodedRow[] = [];
	private input: number[][] = [];
	private params = new NormalizationParams();
	private result: IResult[] = [];

	constructor(dir: string) {
		const file = createReadStream(dir);

		this.insert(file);
	}

	insert = (file: ReadStream) => {
		Papa.parse(file, {
			delimiter: ";",
			header: true,
			quoteChar: '"',
			worker: true,
			error: (err) => {
				console.log(err);
			},
			complete: (res) => {
				this.rows = res.data as IRow[];

				this.drop();
			},
		});
	};

	drop = () => {
		// drops uid, unnamed column, and is_scammer
		this.rows = this.rows.map(({ uid, "": _, is_scammer, source, ...element }) => {
			this.result.push({
				uid: uid!,
			});

			return element;
		});

		this.toTimestamp();
	};

	toTimestamp = () => {
		this.rows = this.rows.map(({ trx_date, report_date, registereddate, birthday, ...element }) => {
			const [trx_day, trx_month, trx_year] = (trx_date as string).split("/");
			const [report_day, report_month, report_year] = (report_date as string).split("/");
			const [registered_day, registered_month, registered_year] = (registereddate as string).split("/");
			const [birth_day, birth_month, birth_year] = (birthday as string).split("/");

			const trx_date_in_days = Math.round(
				new Date(+trx_year, +trx_month - 1, +trx_day).getTime() / (24 * 60 * 60 * 1000)
			);
			const report_date_in_days = Math.round(
				new Date(+report_year, +report_month - 1, +report_day).getTime() / (24 * 60 * 60 * 1000)
			);
			const registered_date_in_days = Math.round(
				new Date(+registered_year, +registered_month - 1, +registered_day).getTime() / (24 * 60 * 60 * 1000)
			);
			const birth_date_in_days = Math.round(
				new Date(+birth_year, +birth_month - 1, +birth_day).getTime() / (24 * 60 * 60 * 1000)
			);

			const res = {
				trx_date: trx_date_in_days,
				report_date: report_date_in_days,
				registereddate: registered_date_in_days,
				birthday: birth_date_in_days,
				...element,
			};

			return res;
		});

		this.hotEncoding();
	};

	hotEncoding = () => {
		this.encodedRows = this.rows.map(({ job_position, gender, source, ...element }) => {
			job_position = job_position.replace(/\s/g, "");
			job_position = job_position.replace("/", "");

			const karyawan = [
				/(.*(?:KARYAWAN).*)/,
				/(.*(?:BURUH).*)/,
				/PILOT/,
				/PELAUT/,
				/PETANIPEKEBUN/,
				/PETERNAK/,
				/NELAYANPERIKANAN/,
				/SOPIR/,
				/AKUNTAN/,
				/TRANSPORTASI/,
				/PENATARIAS/,
				/PENATARAMBUT/,
				/PENATABUSANA/,
				/PENGEMUDI/,
				/PENYIARTELEVISI/,
				/PENYIARRADIO/,
			];

			const tidak_kerja = [/(.*(?:TIDAK).*)/, /(.*(?:BELUM).*)/, /PENSIUNAN/, /PENSIUN/];

			const pelajar = [/(.*(?:PELAJAR).*)/];

			const wiraswasta = [
				/(.*(?:SWASTA).*)/,
				/(.*(?:WIRA).*)/,
				/PERDAGANGAN/,
				/INDUSTRI/,
				/KONSTRUKSI/,
				/PEDAGANG/,
				/WIASRWASTA/,
			];

			const spesialis = [
				/(.*(?:TUKANG).*)/,
				/GURU/,
				/DOSEN/,
				/BIDAN/,
				/DOKTER/,
				/WARTAWAN/,
				/APOTEKER/,
				/PERAWAT/,
				/PENGACARA/,
				/PENELITI/,
				/PARAJI/,
				/KONSULTAN/,
				/PERANCANGBUSANA/,
				/HAKIM/,
				/ARSITEK/,
				/PENTERJEMAH/,
				/JURUMASAK/,
				/MEKANIK/,
				/NOTARIS/,
			];

			const pns = [
				/(.*(?:BUMN).*)/,
				/(.*(?:BUMD).*)/,
				/(.*(?:ANGGOTA).*)/,
				/PERANGKATDESA/,
				/PEGAWAINEGERISIPIL/,
				/KEPOLISIANRI/,
				/GUBERNUR/,
				/TENTARANASIONALINDONESIA/,
				/KEPALADESA/,
				/WALIKOTA/,
				/BUPATI/,
				/DUTABESAR/,
			];

			const rumahtangga = [/(.*(?:RUMAH).*)/];

			const lainnya = [
				/(.*(?:LAIN).*)/,
				/^[A-Z0-9]{0,3}$/,
				/SENIMAN/,
				/TABIB/,
				/USTADZMUBALIGH/,
				/OHTERS/,
				/OTHERS/,
				/PASTUR/,
				/PARANORMAL/,
				/PIALANG/,
				/IMAMMASJID/,
				/PENDETA/,
				/BIARAWATI/,
			];

			job_position = job_position.replace(new RegExp(lainnya.map((regex) => regex.source).join("|"), "gi"), "LAINNYA");
			job_position = job_position.replace(new RegExp(pns.map((regex) => regex.source).join("|"), "gi"), "PEGAWAI_NS");
			job_position = job_position.replace(new RegExp(pelajar.map((regex) => regex.source).join("|"), "gi"), "PELAJAR");
			job_position = job_position.replace(
				new RegExp(karyawan.map((regex) => regex.source).join("|"), "gi"),
				"KARYAWAN"
			);
			job_position = job_position.replace(
				new RegExp(wiraswasta.map((regex) => regex.source).join("|"), "gi"),
				"WIRASWASTA"
			);
			job_position = job_position.replace(
				new RegExp(spesialis.map((regex) => regex.source).join("|"), "gi"),
				"SPESIALIS"
			);
			job_position = job_position.replace(
				new RegExp(rumahtangga.map((regex) => regex.source).join("|"), "gi"),
				"RUMAH_TANGGA"
			);
			job_position = job_position.replace(
				new RegExp(tidak_kerja.map((regex) => regex.source).join("|"), "gi"),
				"TIDAK_KERJA"
			);

			const hashJob: any = {
				job_position_LAINNYA: 0,
				job_position_PEGAWAI_NS: 0,
				job_position_PELAJAR: 0,
				job_position_KARYAWAN: 0,
				job_position_WIRASWASTA: 0,
				job_position_SPESIALIS: 0,
				job_position_RUMAH_TANGGA: 0,
				job_position_TIDAK_KERJA: 0,
			};

			hashJob["job_position_" + job_position] = 1;

			const hashGender: any = {
				gender_Male: 0,
				gender_Female: 0,
				gender_None: 0,
			};

			hashGender["gender_" + gender] = 1;

			const res: IEncodedRow = {
				...hashGender,
				...hashJob,
				...element,
			};
			return res;
		});

		this.clip();
	};

	clip = () => {
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

		this.consumeModel();
	};

	consumeModel = async () => {
		const p = path.join(__dirname, "../../../models", "model.json");

		const model = await tf.loadLayersModel(`file://${p}`);

		this.input.forEach((value, index) => {
			const tensor = tf.tensor(value).reshape([1, 51]);
			const output = model.predict(tensor.reshape([1, 51])) as tf.Tensor<tf.Rank>;
			const predictionValue = output.dataSync();

			tf.dispose(tensor);
			tf.dispose(predictionValue);

			this.result[index].predictScore = Number(predictionValue);
			this.result[index].isScammer = Number(predictionValue) > 0.5 ? 1 : 0;
		});

		this.export();
	};

	export = () => {
		const csvContent = [
			["uid", "predictionScore", "isScammer"].join(","),
			...this.result.map((obj) => obj.uid + "," + obj.predictScore + "," + obj.isScammer),
		].join("\n");

		writeFileSync(path.join(__dirname, "../../../public/out", `${uuidv4()}.csv`), csvContent, "utf-8");
	};
}
