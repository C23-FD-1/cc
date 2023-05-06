import { prisma } from "../../prisma/client";
import bcrypt from "bcrypt";

interface AuthRequest {
	email: string;
	password: string;
}

export default class AuthService {
	login = async ({ email, password }: AuthRequest) => {
		const user = await prisma.user.findFirst({
			where: {
				email,
			},
		});

		if (!user) throw new Error("Invalid Credentials");

		const success = await bcrypt.compare(password, user.password);

		if (!success) throw new Error("Invalid Credentials");

		return { id: user.id, email: user.email, name: user.name };
	};
}
