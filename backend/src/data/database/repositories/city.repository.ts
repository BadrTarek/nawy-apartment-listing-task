import { ICityRepository } from "../../../domain/interfaces/repositories/city-repository.interface";
import { City as CityEntity } from "../../../domain/entities/city.entity";
import { City as CityModel } from '../models/city.model';
import { QueryRunner, ILike } from 'typeorm';

export class CityRepository implements ICityRepository {
    private readonly queryRunner: QueryRunner;

    constructor(queryRunner: QueryRunner) {
        this.queryRunner = queryRunner;
    }

    private getRepository() {
        return this.queryRunner.manager.getRepository(CityModel);
    }

    public async searchByName(name: string, countryId: number): Promise<CityEntity[]> {
        const cities = await this.getRepository().find({
            where: {
                name: ILike(`%${name}%`),
                countryId: countryId,
                isActive: true
            }
        });

        return cities.map(city => ({
            id: city.id,
            name: city.name,
            countryId: city.countryId,
            isActive: city.isActive,
            createdAt: city.createdAt,
            updatedAt: city.updatedAt
        }));
    }

    public async listByCountryId(countryId: number): Promise<CityEntity[]> {
        const cities = await this.getRepository().find({
            where: {
                countryId: countryId,
                isActive: true
            }
        });

        return cities.map(city => ({
            id: city.id,
            name: city.name,
            countryId: city.countryId,
            isActive: city.isActive,
            createdAt: city.createdAt,
            updatedAt: city.updatedAt
        }));
    }
}
