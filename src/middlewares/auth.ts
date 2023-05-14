import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const accessToken: string | undefined = req.cookies["accessToken"];
		if (!accessToken) throw new Error("Unauthorized!");

		// verify
		jwt.verify(accessToken, process.env.JWT_SECRET!);

		next();
	} catch (e) {
		res.status(401).send("Unauthorized");
	}
};
