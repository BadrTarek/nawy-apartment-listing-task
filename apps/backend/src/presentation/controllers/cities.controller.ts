import { Request, Response } from "express";
import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { CityService } from "../../application/services/city.service";

export class CitiesController {
    private readonly cityService: CityService;

    constructor(private readonly unitOfWork: IUnitOfWork) {
        this.cityService = new CityService(unitOfWork);
    }

    async search(req: Request, res: Response): Promise<void> {
        try {
            const { name, countryId } = req.query;
            if (typeof name !== 'string' || !countryId || isNaN(Number(countryId))) {
                res.status(400).json({
                    message: 'Name parameter is required and must be a string, countryId is required and must be a number'
                });
                return;
            }
            await this.unitOfWork.beginTransaction();
            const cities = await this.cityService.searchByName(name, Number(countryId));
            res.json(cities);
        } catch (error) {
            console.error('Error searching cities:', error);
            res.status(500).json({
                message: 'Error searching cities',
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

    async listByCountry(req: Request, res: Response): Promise<void> {
        try {
            const { countryId } = req.params;
            if (!countryId || isNaN(Number(countryId))) {
                res.status(400).json({ message: 'Country ID is required and must be a number' });
                return;
            }
            await this.unitOfWork.beginTransaction();
            const cities = await this.cityService.listByCountryId(Number(countryId));
            res.json(cities);
        } catch (error) {
            console.error('Error listing cities:', error);
            res.status(500).json({
                message: 'Error listing cities',
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
