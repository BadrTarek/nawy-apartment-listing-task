import { IApartmentRepository } from "./repositories/apartment-repository.interface";
import { IApartmentFeatureMappingRepository } from "./repositories/apartment-feature-mapping-repository.interface";

export interface IUnitOfWork {
    // Repositories
    apartmentRepository: IApartmentRepository;
    apartmentFeatureMappingRepository: IApartmentFeatureMappingRepository;

    // Methods
    beginTransaction(): Promise<void>
    commit(): Promise<void>;
    rollback(): Promise<void>;
}