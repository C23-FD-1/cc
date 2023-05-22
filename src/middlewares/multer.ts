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

const upload = multer({
	fileFilter,
	dest: "./uploads",
});

export default upload;
