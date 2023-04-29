import { Request, Response, NextFunction, Router } from "express";
import UserController from "../controlllers/user.controller";

const userRouter = Router();
const controller = new UserController();

const middleware = async (_req: Request, _res: Response, next: NextFunction) => {
	console.log("hi from middleware");
	next();
};

userRouter.use(middleware);

userRouter.get("/", controller.index);
userRouter.post("/", controller.post);

export default userRouter;
