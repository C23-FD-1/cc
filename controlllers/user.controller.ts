import { Request, Response } from "express";
import { User } from "../entity/user";
import BaseResourceController from "./base.controller";

export default class UserController extends BaseResourceController {
	public static model: string = "user";

	index = async (_: Request, res: Response) => {
		try {
			const users = await User.find();
			res.status(200).send(users);
		} catch (e) {
			res.status(500).send(e);
		}
	};

	get = async (req: Request, res: Response) => {
		try {
			const id = parseInt(req.params.id);
			const user = await User.findOneBy({ id: id });
			res.status(200).send(user);
		} catch (e) {
			res.status(500).send(e);
		}
	};

	post = async (req: Request, res: Response) => {
		try {
			const { firstName, lastName, age } = req.body;
			const user = User.create({
				firstName,
				lastName,
				age,
			});

			res.status(200).send(user);
		} catch (e) {
			res.status(500).send(e);
		}
	};

	delete = async (req: Request, res: Response) => {
		try {
			const id = parseInt(req.params.id);
			const users = await User.delete(id);
			res.status(200).send(users);
		} catch (e) {
			res.status(500).send(e);
		}
	};
}
