import { IApartmentRepository } from "./repositories/apartment-repository.interface";
import { IApartmentFeatureMappingRepository } from "./repositories/apartment-feature-mapping-repository.interface";
import { IApartmentImageRepository } from "./repositories/apartment-image-repository.interface";

export interface IUnitOfWork {
    // Repositories
    apartmentRepository: IApartmentRepository;
    apartmentFeatureMappingRepository: IApartmentFeatureMappingRepository;
    apartmentImageRepository: IApartmentImageRepository;

    // Methods
    beginTransaction(): Promise<void>
    commit(): Promise<void>;
    rollback(): Promise<void>;
}