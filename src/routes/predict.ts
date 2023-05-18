import { Router } from "express";
import PredictController from "../controllers/predict";

const predictRouter = Router();
const controller = new PredictController();

predictRouter.post("/", controller.upload);

export default predictRouter;
