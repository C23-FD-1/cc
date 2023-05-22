import { createReadStream } from "fs";
import Papa from "papaparse";

export default class NormalizationParams {
	public minMaxObj: any = {};

	constructor() {
		const file = createReadStream("./private/norm.csv");

		Papa.parse(file, {
			delimiter: ";",
			header: true,
			quoteChar: '"',
			worker: true,
			error: (err) => {
				console.log(err);
			},
			complete: (res) => {
				res.data.forEach((item: any) => {
					const [colName, min, max] = item["col_name,min,max"].split(",");
					this.minMaxObj[colName] = {
						min: Number(min),
						max: Number(max),
					};
				});
			},
		});
	}

	getKeys() {
		return Object.keys(this.minMaxObj);
	}

	getParams() {
		return this.minMaxObj;
	}
}
