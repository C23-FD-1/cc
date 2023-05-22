import { Router } from "express";
import PredictController from "../controllers/predict";
import upload from "../middlewares/multer";

const predictRouter = Router();
const controller = new PredictController();

predictRouter.post("/", upload.single("file"), controller.upload);

export default predictRouter;
