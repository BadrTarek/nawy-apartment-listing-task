import { NextFunction, Request, Response } from "express";
import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { AreaService } from "../../application/services/area.service";
import { ValidationError } from "../../domain/errors/validation.error";

export class AreasController {
    private readonly areaService: AreaService;

    constructor(private readonly unitOfWork: IUnitOfWork) {
        this.areaService = new AreaService(unitOfWork);
    }

    async search(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { name, cityId } = req.query;
            if (typeof name !== 'string' || !cityId || isNaN(Number(cityId))) {
                throw new ValidationError('Name parameter is required and must be a string, cityId is required and must be a number' as any);
            }
            await this.unitOfWork.beginTransaction();
            const areas = await this.areaService.searchByName(name, Number(cityId));
            res.json(areas);
            await this.unitOfWork.commit();
        } catch (error) {
            await this.unitOfWork.rollback();
            next(error);
        }
    }

    async listByCity(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { cityId } = req.params;
            if (!cityId || isNaN(Number(cityId))) {
                throw new ValidationError('City ID is required and must be a number' as any);
            }
            await this.unitOfWork.beginTransaction();
            const areas = await this.areaService.listByCityId(Number(cityId));
            res.json(areas);
            await this.unitOfWork.commit();
        } catch (error) {
            await this.unitOfWork.rollback();
            next(error);
        }
    }
}
