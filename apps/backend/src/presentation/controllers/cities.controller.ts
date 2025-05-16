import { NextFunction, Request, Response } from "express";
import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { CityService } from "../../application/services/city.service";
import { DataSource } from "typeorm";
import { UnitOfWork } from "../../data/database/unit-of-work";

export class CitiesController {
    private readonly cityService: CityService;
    private readonly unitOfWork: IUnitOfWork;

    constructor(
        dataSource: DataSource
    ) {
        this.unitOfWork = new UnitOfWork(dataSource);
        this.cityService = new CityService(this.unitOfWork);
    }

    async search(req: Request, res: Response, next: NextFunction): Promise<void> {
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
            await this.unitOfWork.commit();
        } catch (error) {
            await this.unitOfWork.rollback();
            next(error);
        }
    }

    async listByCountry(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { countryId } = req.params;
            if (!countryId || isNaN(Number(countryId))) {
                res.status(400).json({ message: 'Country ID is required and must be a number' });
                return;
            }
            await this.unitOfWork.beginTransaction();
            const cities = await this.cityService.listByCountryId(Number(countryId));
            res.json(cities);
            await this.unitOfWork.commit();
        } catch (error) {
            await this.unitOfWork.rollback();
            next(error);
        }
    }
}
