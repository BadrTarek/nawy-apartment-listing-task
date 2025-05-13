import { Request, Response } from "express";

export class ApartmentsController {
    async getAllApartments(req: Request, res: Response): Promise<void> {
        try {
            res.status(200).json("Message: 'Hello World! from getAllApartments'");
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    }
}