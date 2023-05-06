import { createUser, updateUser } from "../../src/services/user";
import { User } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { prisma } from "../../prisma/__mocks__/index";

describe("user test", () => {
	let user: User;

	beforeEach(() => {
		user = {
			id: parseInt(faker.random.numeric(1)),
			name: faker.name.firstName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
		};
	});

	it("should create new user", async () => {
		const userCreate = {
			name: user.name!,
			email: user.email,
			password: user.password,
			confirmPassword: user.password,
		};

		const response = await prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: user.password,
			},
		});
		expect(response).toMatchObject({
			name: response.name,
			email: response.email,
		});
	});
});
