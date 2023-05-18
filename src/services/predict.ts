import { ReadStream, createReadStream } from "fs";
import Papa from "papaparse";
import { IRow } from "../interfaces/row";

export default class PredictService {
	private rows: IRow[] = [];

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
		this.rows = this.rows.map(({ uid, "": o, is_scammer, ...element }) => element);

		this.toTimestamp();
	};

	toTimestamp = () => {
		this.rows = this.rows.map(({ trx_date, report_date, registereddate, birthday, ...element }) => {
			const [trx_day, trx_month, trx_year] = (trx_date as string).split("/");
			const [report_day, report_month, report_year] = (report_date as string).split("/");
			const [registered_day, registered_month, registered_year] = (registereddate as string).split("/");
			const [birth_day, birth_month, birth_year] = (birthday as string).split("/");

			const trx_date_in_days = Math.floor(
				new Date(+trx_year, +trx_month - 1, +trx_day).getTime() / (24 * 60 * 60 * 1000)
			);
			const report_date_in_days = Math.floor(
				new Date(+report_year, +report_month - 1, +report_day).getTime() / (24 * 60 * 60 * 1000)
			);
			const registered_date_in_days = Math.floor(
				new Date(+registered_year, +registered_month - 1, +registered_day).getTime() / (24 * 60 * 60 * 1000)
			);
			const birth_date_in_days = Math.floor(
				new Date(+birth_year, +birth_month - 1, +birth_day).getTime() / (24 * 60 * 60 * 1000)
			);

			const res: IRow = {
				trx_date: trx_date_in_days,
				report_date: report_date_in_days,
				registereddate: registered_date_in_days,
				birthday: birth_date_in_days,
				...element,
			};

			return res;
		});
	};

	hotEncoding = () => {};
}
