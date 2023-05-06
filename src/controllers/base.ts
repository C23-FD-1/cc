import { Request, Response } from "express";

export default abstract class BaseResourceController {
	abstract index(req: Request, res: Response): void;
	abstract get(req: Request, res: Response): void;
	abstract post(req: Request, res: Response): void;
	abstract update(req: Request, res: Response): void;
	abstract delete(req: Request, res: Response): void;
}
