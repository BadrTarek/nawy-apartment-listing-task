import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { ApartmentFeature } from "../../domain/entities/apartment-feature.entity";

export class ApartmentFeatureService {
    constructor(
        private readonly unitOfWork: IUnitOfWork
    ) { }

    async list(): Promise<ApartmentFeature[]> {
        return await this.unitOfWork.apartmentFeatureRepository.list();
    }
} 