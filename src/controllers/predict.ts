import { Request, Response } from "express";
import PredictService from "../services/predict";
import { unlink, unlinkSync } from "fs";

export default class PredictController {
	upload = async (req: Request, res: Response) => {
		if (req.file) {
			const path = `${req.file.destination}/${req.file.filename}`;
			const pred = new PredictService(path);
			await pred.insert();
			await pred.drop();
			await pred.toTimestamp();
			await pred.hotEncode();
			await pred.clip();
			await pred.consumeModel();
			await pred.export();

			unlinkSync(path);

			res.status(200).redirect("http://localhost:8000/out/" + pred.outName);
		}
	};
}
