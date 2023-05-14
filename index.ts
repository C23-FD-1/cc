import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import "reflect-metadata";
import router from "./src/routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());

app.use(cors());

app.use(router);

const server = app.listen(PORT, () => {
	console.info(`server started using port ${PORT}`);
});

export default server;
