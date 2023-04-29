import { DataSource } from "typeorm";
import { User } from "../entity/user";

const AppDataSource = new DataSource({
	type: "mysql",
	host: "localhost",
	port: 3306,
	username: "root",
	database: "test",
	synchronize: true,
	logging: false,
	entities: [User],
});

export default AppDataSource;
