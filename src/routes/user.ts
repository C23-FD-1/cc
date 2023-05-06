import { Router } from "express";
import UserController from "../controllers/user";

const userRouter = Router();
const controller = new UserController();

userRouter.get("/", controller.index);
userRouter.post("/", controller.post);
userRouter.put("/:id", controller.update);

export default userRouter;
