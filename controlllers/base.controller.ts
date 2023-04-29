import { Request, Response } from "express";

export default abstract class BaseResourceController {
	abstract post(req: Request, res: Response): void;
	abstract get(req: Request, res: Response): void;
	abstract index(req: Request, res: Response): void;
	abstract delete(req: Request, res: Response): void;
}
