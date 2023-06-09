import e from "express";
import multer from "multer";
import path from "path";

type DestinationCallback = (error: Error | null, destination: string) => void;
type FileNameCallback = (error: Error | null, filename: string) => void;

const fileFilter = (_: e.Request, file: Express.Multer.File, cb: multer.FileFilterCallback): void => {
	const ext = path.extname(file.originalname);
	if (ext !== ".csv") {
		return cb(new Error("Only CSV files are allowed!"));
	}
	cb(null, true);
};

const destination = (_: e.Request, __: Express.Multer.File, cb: DestinationCallback): void => {
	cb(null, "./uploads");
};

const filename = (_: e.Request, file: Express.Multer.File, cb: FileNameCallback): void => {
	const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
	cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
};

const storage = multer.diskStorage({
	destination,
	filename,
});

const upload = multer({
	fileFilter,
	storage,
});

export default upload;
