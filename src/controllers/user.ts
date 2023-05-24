import { Request, Response } from "express";
import BaseResourceController from "./base";
import UserService from "../services/user";

export default class UserController extends BaseResourceController {
	private service = new UserService();

	index = async (_: Request, res: Response) => {
		try {
			const users = await this.service.findAll();
			res.status(200).send(users);
		} catch (e) {
			res.status(500).send(e);
		}
	};

	get = async (req: Request, res: Response) => {
		try {
			const id = parseInt(req.params.id);
			const user = await this.service.find(id);
			res.status(200).send(user);
		} catch (e) {
			res.status(500).send(e);
		}
	};

	post = async (req: Request, res: Response) => {
		try {
			const { name, email, password, confirmPassword } = req.body;
			const user = await this.service.create({ name, email, password, confirmPassword });

			res.status(201).send(user);
		} catch (e) {
			console.log(e);
			res.status(500).send(e);
		}
	};

	update = async (req: Request, res: Response) => {
		try {
			const { name, email } = req.body;
			const id = parseInt(req.params.id);
			const user = await this.service.update({ id, name, email });
			res.status(200).send(user);
		} catch (e) {
			res.status(500).send(e);
		}
	};

	delete = async (req: Request, res: Response) => {
		try {
			const id = parseInt(req.params.id);
			const users = await this.service.delete(id);

			res.status(200).send(users);
		} catch (e) {
			res.status(500).send(e);
		}
	};
}
