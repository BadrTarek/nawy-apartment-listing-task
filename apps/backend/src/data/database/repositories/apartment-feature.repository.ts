import { IApartmentFeatureRepository } from "../../../domain/interfaces/repositories/feature-repository.interface";
import { ApartmentFeature as FeatureEntity } from "../../../domain/entities/apartment-feature.entity";
import { ApartmentFeature as FeatureModel } from '../models/apartment-feature.model';
import { QueryRunner } from 'typeorm';

export class ApartmentFeatureRepository implements IApartmentFeatureRepository {
    private readonly queryRunner: QueryRunner;

    constructor(queryRunner: QueryRunner) {
        this.queryRunner = queryRunner;
    }

    private getRepository() {
        return this.queryRunner.manager.getRepository(FeatureModel);
    }

    public async list(): Promise<FeatureEntity[]> {
        const features = await this.getRepository().find({
            where: {
                isActive: true
            }
        });

        return features.map(feature => ({
            id: feature.id,
            name: feature.name,
            isActive: feature.isActive,
            createdAt: feature.createdAt,
            updatedAt: feature.updatedAt
        }));
    }
} 