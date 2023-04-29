import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "reflect-metadata";
import AppDataSource from "./config/database";
import router from "./route";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cors());

app.use(router);

AppDataSource.initialize()
	.then(async () => {
		console.info(`database connected`);
	})
	.catch((e) => {
		console.log(e);
	});

app.listen(PORT, () => {
	console.info(`server started using port ${PORT}`);
});

export default app;
