import { Router } from "express";
import PredictController from "../controllers/predict";
import upload from "../middlewares/multer";
import { authenticate } from "../middlewares/auth";

const predictRouter = Router();
const controller = new PredictController();

predictRouter.post("/", upload.single("file"), controller.upload);
predictRouter.get("/", controller.history);

export default predictRouter;
