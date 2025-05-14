import { Request, Response } from "express";
import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { CountryService } from "../../application/services/country.service";

export class CountriesController {
    private readonly countryService: CountryService;

    constructor(private readonly unitOfWork: IUnitOfWork) {
        this.countryService = new CountryService(unitOfWork);
    }

    async search(req: Request, res: Response): Promise<void> {
        try {
            const { name } = req.query;
            if (typeof name !== 'string') {
                res.status(400).json({ message: 'Name parameter is required and must be a string' });
                return;
            }

            await this.unitOfWork.beginTransaction();
            const countries = await this.countryService.searchByName(name);
            res.json(countries);
        } catch (error) {
            console.error('Error searching countries:', error);
            res.status(500).json({
                message: 'Error searching countries',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        } finally {
            // Ensure transaction is committed or rolled back
            try {
                await this.unitOfWork.commit();
            } catch (error) {
                await this.unitOfWork.rollback();
                console.error("Transaction rollback due to error:", error);
            }
        }
    }

    async list(req: Request, res: Response): Promise<void> {
        try {
            await this.unitOfWork.beginTransaction();
            const countries = await this.countryService.list();
            res.json(countries);
        } catch (error) {
            console.error('Error listing countries:', error);
            res.status(500).json({
                message: 'Error listing countries',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        } finally {
            // Ensure transaction is committed or rolled back
            try {
                await this.unitOfWork.commit();
            } catch (error) {
                await this.unitOfWork.rollback();
                console.error("Transaction rollback due to error:", error);
            }
        }
    }
}
