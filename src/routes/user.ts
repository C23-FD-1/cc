import { Router } from "express";
import UserController from "../controllers/user";

const userRouter = Router();
const controller = new UserController();

userRouter.get("/", controller.index);
userRouter.get("/:id", controller.get);
userRouter.post("/", controller.post);
userRouter.put("/:id", controller.update);
userRouter.delete("/:id", controller.delete);

export default userRouter;
