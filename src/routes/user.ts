import { Router } from "express";
import UserController from "../controllers/user";
import { authenticate } from "../middlewares/auth";

const userRouter = Router();
const controller = new UserController();

userRouter.post("/", controller.post);

userRouter.use(authenticate);
userRouter.get("/", controller.index);
userRouter.get("/:id", controller.get);
userRouter.put("/:id", controller.update);
userRouter.delete("/:id", controller.delete);

export default userRouter;
