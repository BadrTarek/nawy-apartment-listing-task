import { NextFunction, Request, Response } from "express";
import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { ApartmentFeatureService } from "../../application/services/apartment-feature.service";
import { inject, injectable } from "tsyringe";

@injectable()
export class ApartmentFeaturesController {
    private readonly featureService: ApartmentFeatureService;

    constructor(
        @inject("IUnitOfWork") private readonly unitOfWork: IUnitOfWork,
    ) {
        this.featureService = new ApartmentFeatureService(unitOfWork);
    }

    async list(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            await this.unitOfWork.beginTransaction();
            const features = await this.featureService.list();
            res.json(features);
            await this.unitOfWork.commit();
        } catch (error) {
            await this.unitOfWork.rollback();
            next(error);
        }
    }
} 