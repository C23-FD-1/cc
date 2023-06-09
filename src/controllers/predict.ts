import { Request, Response } from "express";
import PredictService from "../services/predict";
import { unlink, unlinkSync } from "fs";
import { prisma } from "../../prisma/client";

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
			const url = await pred.export();
			const numericData = await pred.getNumericData();

			unlinkSync(path);

			res.status(200).json({
				url: url,
				percentage: numericData.percentage,
				scammer: numericData.scammer,
			});
		}
	};

	history = async (_: Request, res: Response) => {
		const history = await prisma.predictionHistory.findMany();

		res.status(200).json({
			history,
		});
	};
}
