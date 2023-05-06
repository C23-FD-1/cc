import { Router } from "express";
import AuthController from "../controllers/auth";

const authRouter = Router();
const controller = new AuthController();

authRouter.post("/", controller.login);

export default authRouter;
