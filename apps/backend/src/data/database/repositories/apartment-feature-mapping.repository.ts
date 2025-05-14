import { IApartmentFeatureMappingRepository } from "../../../domain/interfaces/repositories/apartment-feature-mapping-repository.interface";
import { ApartmentFeatureMapping as ApartmentFeatureMappingEntity } from "../../../domain/entities/apartment-feature-mapping.entity";
import { ApartmentFeatureMapping as ApartmentFeatureMappingModel } from '../models/apartment-feature-mapping.model';
import { QueryRunner } from 'typeorm';

export class ApartmentFeatureMappingRepository implements IApartmentFeatureMappingRepository {
    private readonly queryRunner: QueryRunner;

    constructor(queryRunner: QueryRunner) {
        this.queryRunner = queryRunner;
    }

    private getRepository() {
        return this.queryRunner.manager.getRepository(ApartmentFeatureMappingModel);
    }

    public async bulkCreate(apartmentFeatureMappings: ApartmentFeatureMappingEntity[]): Promise<ApartmentFeatureMappingEntity[]> {
        const mappings = await this.getRepository().save(
            apartmentFeatureMappings.map(mapping => ({
                apartmentId: mapping.apartmentId,
                featureId: mapping.featureId,
                featureValue: mapping.featureValue
            }))
        );

        return mappings.map(mapping => ({
            id: mapping.id,
            apartmentId: mapping.apartmentId,
            featureId: mapping.featureId,
            featureValue: mapping.featureValue,
            createdAt: mapping.createdAt
        }));
    }
}
