import { Router } from "express";
import userRouter from "./user";
import authRouter from "./auth";
import predictRouter from "./predict";

const router = Router();

router.use("/user", userRouter);
router.use("/auth", authRouter);
router.use("/pred", predictRouter);

export default router;
