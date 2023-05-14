import { faker } from "@faker-js/faker";
import UserService from "../../src/services/user";
import supertest from "supertest";
import server from "../../";
import { User } from "@prisma/client";

describe("auth test", () => {
	let user: User, userService: UserService;

	beforeAll(async () => {
		user = {
			id: parseInt(faker.random.numeric(1)),
			name: faker.name.firstName(),
			email: faker.internet.email(),
			password: faker.internet.password(),
		};

		userService = new UserService();

		await userService.create({ ...user, confirmPassword: user.password });
	});

	afterAll((done) => {
		server.close(done);
	});

	it("should log a user in", async () => {
		const response = await supertest(server)
			.post("/auth")
			.send({
				email: user.email,
				password: user.password,
			})
			.expect(200);

		expect(JSON.parse(response.text).name).toBe(user.name);
	});
});
