import { ApartmentFeatureMapping as ApartmentFeatureMappingEntity } from "../../entities/apartment-feature-mapping.entity";


export interface IApartmentFeatureMappingRepository {
    bulkCreate(apartmentFeatureMappings: ApartmentFeatureMappingEntity[]): Promise<ApartmentFeatureMappingEntity[]>;
}