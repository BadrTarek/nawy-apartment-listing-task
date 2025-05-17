import { ApartmentFeature } from "../../entities/apartment-feature.entity";

export interface IApartmentFeatureRepository {
    list(): Promise<ApartmentFeature[]>;
} 