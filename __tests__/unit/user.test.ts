import { User } from "@prisma/client";
import { faker } from "@faker-js/faker";
import { prisma } from "../../prisma/__mocks__/index";
import UserService from "../../src/services/user";

describe("user test", () => {
	let user: User, userService: UserService;

	beforeAll(() => {
		userService = new UserService();
	});

	beforeEach(() => {
		user = {
			id: parseInt(faker.random.numeric(1)),
			name: faker.name.firstName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
		};
	});

	it("should create a new user", async () => {
		const userCreate = {
			name: user.name!,
			email: user.email,
			password: user.password,
			confirmPassword: user.password,
		};

		const response = await userService.create(userCreate);

		expect(response).toMatchObject({
			name: response.name,
			email: response.email,
		});

		expect(response.password).not.toBe(userCreate.password);
	});

	it("should get a user", async () => {
		const userCreate = {
			name: user.name!,
			email: user.email,
			password: user.password,
			confirmPassword: user.password,
		};

		const response = await userService.create(userCreate);

		expect(response).toMatchObject({
			name: response.name,
			email: response.email,
		});

		const usr = await userService.find(response.id);

		expect(usr).toMatchObject({
			name: response.name,
			email: response.email,
		});
	});
});
