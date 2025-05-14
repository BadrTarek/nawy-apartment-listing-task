import { IApartmentRepository } from "../../../domain/interfaces/repositories/apartment-repository.interface";
import { Apartment as ApartmentEntity } from "../../../domain/entities/apartment.entity";
import { Apartment as ApartmentOrmModel } from '../models/apartment.model';
import { QueryRunner } from 'typeorm';

export class ApartmentRepository implements IApartmentRepository {
    private readonly queryRunner: QueryRunner;

    constructor(queryRunner: QueryRunner) {
        this.queryRunner = queryRunner;
    }

    private getRepository() {
        return this.queryRunner.manager.getRepository(ApartmentOrmModel);
    }

    public async list(): Promise<ApartmentEntity[]> {
        const apartments = await this.getRepository().find();
        return apartments.map(apartment => ({
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


