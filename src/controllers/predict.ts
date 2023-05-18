import { Request, Response } from "express";
import PredictService from "../services/predict";

export default class PredictController {
	prediction = new PredictService("./private/user_data_test.csv");

	upload = async (req: Request, res: Response) => {
		// this.prediction.clip();
	};
}
