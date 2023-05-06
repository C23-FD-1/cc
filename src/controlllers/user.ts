import { Request, Response } from "express";
import BaseResourceController from "./base";
import prisma from "../../prisma/client";
import UserService from "../services/user";

export default class UserController extends BaseResourceController {
	private service = new UserService(prisma);

	index = async (_: Request, res: Response) => {
		try {
			const users = await this.service.findAllUser();
			res.status(200).send(users);
		} catch (e) {
			res.status(500).send(e);
		}
	};

	get = async (req: Request, res: Response) => {
		try {
			const id = parseInt(req.params.id);
			const user = await this.service.findUser(id);
			res.status(200).send(user);
		} catch (e) {
			res.status(500).send(e);
		}
	};

	post = async (req: Request, res: Response) => {
		try {
			const { name, email, password, confirmPassword } = req.body;
			const user = await this.service.createUser({ name, email, password, confirmPassword });

			res.status(200).send(user);
		} catch (e) {
			res.status(500).send(e);
		}
	};

	update = async (req: Request, res: Response) => {
		try {
			const { name, email } = req.body;
			const id = parseInt(req.params.id);
			const user = await this.service.updateUser({ id, name, email });
			res.status(200).send(user);
		} catch (e) {
			res.status(500).send(e);
		}
	};

	delete = async (req: Request, res: Response) => {
		try {
			const id = parseInt(req.params.id);
			const users = await this.service.deleteUser(id);

			res.status(200).send(users);
		} catch (e) {
			res.status(500).send(e);
		}
	};
}
