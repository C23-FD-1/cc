import { PrismaClient } from "@prisma/client";
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
	protected prismaClient: PrismaClient;

	constructor(prismaClient: PrismaClient) {
		this.prismaClient = prismaClient;
	}

	async findAllUser() {
		return await this.prismaClient.user.findMany();
	}

	async findUser(id: number) {
		return await this.prismaClient.user.findFirst({
			where: {
				id,
			},
		});
	}

	async createUser(user: CreateUser) {
		if (user.password !== user.confirmPassword) {
			throw new Error("The password confirmation does not match");
		}
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(user.password, salt);

		return await this.prismaClient.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: hashedPassword,
			},
		});
	}
	async updateUser(user: UpdateUser) {
		return await this.prismaClient.user.update({
			where: { id: user.id },
			data: user,
		});
	}

	async deleteUser(id: number) {
		return await this.prismaClient.user.delete({
			where: { id: id },
		});
	}
}
