import { DataSource } from "typeorm";
import { User } from "../entity/user";

const AppDataSource = new DataSource({
	type: "postgres",
	url: process.env.DATABASE_URL,
	username: process.env.DB_USERNAME,
	database: process.env.DB_NAME,
	synchronize: true,
	logging: false,
	entities: [User],
});

export default AppDataSource;
