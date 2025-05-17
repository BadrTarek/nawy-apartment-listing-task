import { NextFunction, Request, Response } from "express";
import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { CountryService } from "../../application/services/country.service";
import { inject, injectable } from "tsyringe";
import { ICountryCacheRepository } from "../../domain/interfaces/repositories/cache/country-cache-repository.interface";



@injectable()
export class CountriesController {
    private readonly countryService: CountryService;

    constructor(
        @inject("IUnitOfWork") private readonly unitOfWork: IUnitOfWork,
        @inject("ICountryCacheRepository") private readonly countryCacheRepository: ICountryCacheRepository,
    ) {
        this.countryService = new CountryService(unitOfWork, countryCacheRepository);
    }

    async search(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name } = req.query;
            if (typeof name !== 'string') {
                res.status(400).json({ message: 'Name parameter is required and must be a string' });
                return;
            }

            await this.unitOfWork.beginTransaction();
            const countries = await this.countryService.searchByName(name);
            res.json(countries);
            await this.unitOfWork.commit();
        } catch (error) {
            await this.unitOfWork.rollback();
            next(error);
        }
    }

    async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.unitOfWork.beginTransaction();
            const countries = await this.countryService.list();
            res.json(countries);
            await this.unitOfWork.commit();
        } catch (error) {
            await this.unitOfWork.rollback();
            next(error);
        }
    }
}
