import { prisma } from "../../prisma/client";
import bcrypt from "bcrypt";

interface CreateUser {
	name: string;
	email: string;
	password: string;
	confirmPassword: string;
}

interface UpdateUser {
	id: number;
	name: string;
	email: string;
}

export default class UserService {
	findAll = async () => {
		return await prisma.user.findMany();
	};

	find = async (id: number) => {
		return await prisma.user.findFirst({
			where: {
				id,
			},
		});
	};

	create = async (user: CreateUser) => {
		if (user.password !== user.confirmPassword) {
			throw new Error("The password confirmation does not match");
		}
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(user.password, salt);

		return await prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: hashedPassword,
			},
		});
	};
	update = async (user: UpdateUser) => {
		return await prisma.user.update({
			where: { id: user.id },
			data: user,
		});
	};

	delete = async (id: number) => {
		return await prisma.user.delete({
			where: { id: id },
		});
	};
}
