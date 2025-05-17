import { ICountryRepository } from "../../../domain/interfaces/repositories/country-repository.interface";
import { Country as CountryEntity } from "../../../domain/entities/country.entity";
import { Country as CountryModel } from '../models/country.model';
import { QueryRunner, ILike } from 'typeorm';

export class CountryRepository implements ICountryRepository {
    private readonly queryRunner: QueryRunner;

    constructor(queryRunner: QueryRunner) {
        this.queryRunner = queryRunner;
    }

    private getRepository() {
        return this.queryRunner.manager.getRepository(CountryModel);
    }

    public async searchByName(name: string): Promise<CountryEntity[]> {
        const countries = await this.getRepository().find({
            where: {
                name: ILike(`%${name}%`),
                isActive: true
            }
        });

        return countries.map(country => ({
            id: country.id,
            name: country.name,
            currency: country.currency,
            isActive: country.isActive,
            createdAt: country.createdAt,
            updatedAt: country.updatedAt
        }));
    }

    public async list(): Promise<CountryEntity[]> {
        const countries = await this.getRepository().find({
            where: {
                isActive: true
            }
        });

        return countries.map(country => ({
            id: country.id,
            name: country.name,
            currency: country.currency,
            isActive: country.isActive,
            createdAt: country.createdAt,
            updatedAt: country.updatedAt
        }));
    }
}
