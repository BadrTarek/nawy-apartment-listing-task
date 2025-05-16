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
            bedrooms,
            bathrooms,
            address,
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
                '(apartment.title ILIKE :searchTerm OR apartment.description ILIKE :searchTerm OR apartment.address ILIKE :searchTerm)',
                { searchTerm: `%${searchTerm}%` }
            );
        }
        if (bedrooms !== undefined) {
            queryBuilder.andWhere('apartment.bedrooms = :bedrooms', { bedrooms });
        }
        if (bathrooms !== undefined) {
            queryBuilder.andWhere('apartment.bathrooms = :bathrooms', { bathrooms });
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
            bathrooms: apartment.bathrooms,
            bedrooms: apartment.bedrooms,
            size: apartment.size,
            price: apartment.price,
            areaId: apartment.areaId,
            address: apartment.address,
            longitude: apartment.longitude,
            latitude: apartment.latitude,
            isAvailable: apartment.isAvailable,
            countryName: apartment.area?.city?.country?.name,
            cityName: apartment.area?.city?.name,
            areaName: apartment.area?.name,
            currency: apartment.area?.city?.country?.currency,
            images: apartment.images?.map(image => image.url),
            features: apartment.featureMappings?.map(featureMapping => ({
                "name": featureMapping.feature.name,
                "value": featureMapping.featureValue
            })),
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
            bathrooms: apartment.bathrooms,
            bedrooms: apartment.bedrooms,
            size: apartment.size,
            address: apartment.address,
            areaId: apartment.areaId,
            longitude: apartment.longitude,
            latitude: apartment.latitude,
            isAvailable: apartment.isAvailable,
            countryName: apartment.area?.city?.country?.name,
            cityName: apartment.area?.city?.name,
            areaName: apartment.area?.name,
            currency: apartment.area?.city?.country?.currency,
            images: apartment.images?.map(image => image.url),
            features: apartment.featureMappings?.map(featureMapping => ({
                "name": featureMapping.feature.name,
                "value": featureMapping.featureValue
            })),
            createdAt: apartment.createdAt,
            updatedAt: apartment.updatedAt
        };
    }

    public async create(apartment: ApartmentEntity): Promise<ApartmentEntity> {
        const newApartment = await this.getRepository().save({
            title: apartment.title,
            description: apartment.description,
            price: apartment.price,
            address: apartment.address,
            size: apartment.size,
            bedrooms: apartment.bedrooms,
            bathrooms: apartment.bathrooms,
            areaId: apartment.areaId,
            longitude: apartment.longitude,
            latitude: apartment.latitude,
            isAvailable: apartment.isAvailable
        });

        return {
            id: newApartment.id,
            title: newApartment.title,
            description: newApartment.description,
            price: newApartment.price,
            bathrooms: newApartment.bathrooms,
            bedrooms: newApartment.bedrooms,
            size: newApartment.size,
            address: newApartment.address,
            areaId: newApartment.areaId,
            longitude: newApartment.longitude,
            latitude: newApartment.latitude,
            isAvailable: newApartment.isAvailable,
            countryName: newApartment.area?.city?.country?.name,
            cityName: newApartment.area?.city?.name,
            areaName: newApartment.area?.name,
            currency: newApartment.area?.city?.country?.currency,
            images: newApartment.images?.map(image => image.url),
            features: newApartment.featureMappings?.map(featureMapping => ({
                "name": featureMapping.feature.name,
                "value": featureMapping.featureValue
            })),
            createdAt: newApartment.createdAt,
            updatedAt: newApartment.updatedAt
        };
    }
}


