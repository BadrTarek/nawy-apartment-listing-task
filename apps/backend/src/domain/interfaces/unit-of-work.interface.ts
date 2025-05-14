import { IApartmentRepository } from "./repositories/apartment-repository.interface";
import { IApartmentFeatureMappingRepository } from "./repositories/apartment-feature-mapping-repository.interface";
import { IApartmentImageRepository } from "./repositories/apartment-image-repository.interface";
import { ICountryRepository } from "./repositories/country-repository.interface";
import { ICityRepository } from "./repositories/city-repository.interface";
import { IAreaRepository } from "./repositories/area-repository.interface";

export interface IUnitOfWork {
    // Repositories
    apartmentRepository: IApartmentRepository;
    apartmentFeatureMappingRepository: IApartmentFeatureMappingRepository;
    apartmentImageRepository: IApartmentImageRepository;
    countryRepository: ICountryRepository;
    cityRepository: ICityRepository;
    areaRepository: IAreaRepository;

    // Methods
    beginTransaction(): Promise<void>
    commit(): Promise<void>;
    rollback(): Promise<void>;
}