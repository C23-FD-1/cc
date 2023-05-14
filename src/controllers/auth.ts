import { Request, Response } from "express";
import AuthService from "../services/auth";
import jwt from "jsonwebtoken";

export default class AuthController {
	private service = new AuthService();

	login = async (req: Request, res: Response) => {
		try {
			const { email, password } = req.body;
			const payload = await this.service.login({ email, password });
			const accessToken = jwt.sign(payload, process.env.JWT_SECRET!, {
				expiresIn: "15m",
			});
			const refreshToken = jwt.sign(payload, process.env.JWT_SECRET!, {
				expiresIn: "30d",
			});

			res.cookie("accessToken", accessToken, {
				sameSite: "none",
				secure: false,
				maxAge: 15 * 60 * 1000,
			});

			res.cookie("refreshToken", refreshToken, {
				sameSite: "none",
				secure: false,
				httpOnly: true,
				maxAge: 30 * 24 * 60 * 1000,
			});

			res.status(200).json({ name: payload.name, accessToken });
		} catch (e) {
			res.status(500).send(e);
		}
	};
}
