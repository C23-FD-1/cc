import { Request, Response } from "express";
import BaseResourceController from "./base";
import prisma from "../../prisma/client";
import { createUser, deleteUser, updateUser } from "../services/user";

export default class UserController extends BaseResourceController {
	index = async (_: Request, res: Response) => {
		try {
			const users = await prisma.user.findMany();
			res.status(200).send(users);
		} catch (e) {
			res.status(500).send(e);
		}
	};

	get = async (req: Request, res: Response) => {
		try {
			const id = parseInt(req.params.id);
			const user = await prisma.user.findFirst({
				where: {
					id,
				},
			});
			res.status(200).send(user);
		} catch (e) {
			res.status(500).send(e);
		}
	};

	post = async (req: Request, res: Response) => {
		try {
			const { name, email, password, confirmPassword } = req.body;
			const user = await createUser({ name, email, password, confirmPassword });

			res.status(200).send(user);
		} catch (e) {
			res.status(500).send(e);
		}
	};

	update = async (req: Request, res: Response) => {
		try {
			const { name, email } = req.body;
			const id = parseInt(req.params.id);
			const user = await updateUser({ id, name, email });
			res.status(200).send(user);
		} catch (e) {
			res.status(500).send(e);
		}
	};

	delete = async (req: Request, res: Response) => {
		try {
			const id = parseInt(req.params.id);
			const users = await deleteUser(id);

			res.status(200).send(users);
		} catch (e) {
			res.status(500).send(e);
		}
	};
}
