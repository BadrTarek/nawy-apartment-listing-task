import { IApartmentImageRepository } from "../../../domain/interfaces/repositories/apartment-image-repository.interface";
import { ApartmentImage as ApartmentImageEntity } from "../../../domain/entities/apartment-image.entity";
import { ApartmentImage as ApartmentImageModel } from '../models/apartment-image.model';
import { QueryRunner } from 'typeorm';

export class ApartmentImageRepository implements IApartmentImageRepository {
    private readonly queryRunner: QueryRunner;

    constructor(queryRunner: QueryRunner) {
        this.queryRunner = queryRunner;
    }

    private getRepository() {
        return this.queryRunner.manager.getRepository(ApartmentImageModel);
    }

    public async bulkCreate(images: ApartmentImageEntity[]): Promise<ApartmentImageEntity[]> {
        const savedImages = await this.getRepository().save(
            images.map(image => ({
                url: image.url,
                apartmentId: image.apartmentId,
                isActive: true
            }))
        );

        return savedImages.map(image => ({
            id: image.id,
            url: image.url,
            apartmentId: image.apartmentId,
            isActive: image.isActive,
            createdAt: image.createdAt,
            updatedAt: image.updatedAt
        }));
    }
}
