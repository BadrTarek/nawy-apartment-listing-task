import { IApartmentRepository } from "../../../domain/interfaces/repositories/apartment-repository.interface";
import { Apartment as ApartmentEntity } from "../../../domain/entities/apartment.entity";
import { Apartment as ApartmentOrmModel } from '../models/apartment.model';
import { QueryRunner } from 'typeorm';
import { ApartmentFilter } from "../../../domain/interfaces/filters/apartment-filter.interface";

export class ApartmentRepository implements IApartmentRepository {
    private readonly queryRunner: QueryRunner;

    constructor(queryRunner: QueryRunner) {
        this.queryRunner = queryRunner;
    }

    private getRepository() {
        return this.queryRunner.manager.getRepository(ApartmentOrmModel);
    }

    public async filter(filter: ApartmentFilter): Promise<{ data: ApartmentEntity[], total: number }> {
        const {
            minPrice,
            maxPrice,
            areaId,
            cityId,
            countryId,
            searchTerm,
            isAvailable,
            skip,
            take
        } = filter;

        const queryBuilder = this.getRepository()
            .createQueryBuilder('apartment')
            .leftJoinAndSelect('apartment.area', 'area')
            .leftJoinAndSelect('area.city', 'city')
            .leftJoinAndSelect('city.country', 'country')
            .leftJoinAndSelect('apartment.images', 'images')
            .leftJoinAndSelect('apartment.featureMappings', 'featureMappings')
            .leftJoinAndSelect('featureMappings.feature', 'feature');

        // Apply filters
        if (minPrice !== undefined) {
            queryBuilder.andWhere('apartment.price >= :minPrice', { minPrice });
        }

        if (maxPrice !== undefined) {
            queryBuilder.andWhere('apartment.price <= :maxPrice', { maxPrice });
        }

        if (areaId !== undefined) {
            queryBuilder.andWhere('apartment.areaId = :areaId', { areaId });
        }

        if (cityId !== undefined) {
            queryBuilder.andWhere('area.cityId = :cityId', { cityId });
        }

        if (countryId !== undefined) {
            queryBuilder.andWhere('city.countryId = :countryId', { countryId });
        }

        if (searchTerm !== undefined) {
            queryBuilder.andWhere(
                '(apartment.title ILIKE :searchTerm OR apartment.description ILIKE :searchTerm)',
                { searchTerm: `%${searchTerm}%` }
            );
        }

        if (isAvailable !== undefined) {
            queryBuilder.andWhere('apartment.isAvailable = :isAvailable', { isAvailable });
        }

        // Get total count for pagination
        const total = await queryBuilder.getCount();

        // Apply pagination
        queryBuilder.skip(skip).take(take);

        // Execute query
        const apartments = await queryBuilder.getMany();

        // Map to entity
        const apartmentEntities = apartments.map(apartment => ({
            id: apartment.id,
            title: apartment.title,
            description: apartment.description,
            price: apartment.price,
            areaId: apartment.areaId,
            address: apartment.address,
            isAvailable: apartment.isAvailable,
            createdAt: apartment.createdAt,
            updatedAt: apartment.updatedAt
        }));

        return {
            data: apartmentEntities,
            total
        };
    }

    public async getById(id: number): Promise<ApartmentEntity | null> {
        const apartment = await this.getRepository().findOneBy({ id });
        if (!apartment) return null;

        return {
            id: apartment.id,
            title: apartment.title,
            description: apartment.description,
            price: apartment.price,
            areaId: apartment.areaId,
            address: apartment.address,
            isAvailable: apartment.isAvailable,
            createdAt: apartment.createdAt,
            updatedAt: apartment.updatedAt
        };
    }

    public async create(apartment: ApartmentEntity): Promise<ApartmentEntity> {
        const newApartment = await this.getRepository().save({
            title: apartment.title,
            description: apartment.description,
            price: apartment.price,
            areaId: apartment.areaId,
            address: apartment.address,
            isAvailable: apartment.isAvailable
        });

        return {
            id: newApartment.id,
            title: newApartment.title,
            description: newApartment.description,
            price: newApartment.price,
            areaId: newApartment.areaId,
            address: newApartment.address,
            isAvailable: newApartment.isAvailable,
            createdAt: newApartment.createdAt,
            updatedAt: newApartment.updatedAt
        };
    }
}


