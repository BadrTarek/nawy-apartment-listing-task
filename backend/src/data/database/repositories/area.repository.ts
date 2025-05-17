import { IAreaRepository } from "../../../domain/interfaces/repositories/area-repository.interface";
import { Area as AreaEntity } from "../../../domain/entities/area.entity";
import { Area as AreaModel } from '../models/area.model';
import { QueryRunner, ILike } from 'typeorm';

export class AreaRepository implements IAreaRepository {
    private readonly queryRunner: QueryRunner;

    constructor(queryRunner: QueryRunner) {
        this.queryRunner = queryRunner;
    }

    private getRepository() {
        return this.queryRunner.manager.getRepository(AreaModel);
    }

    public async searchByName(name: string, cityId: number): Promise<AreaEntity[]> {
        const areas = await this.getRepository().find({
            where: {
                name: ILike(`%${name}%`),
                cityId: cityId,
                isActive: true
            }
        });

        return areas.map(area => ({
            id: area.id,
            name: area.name,
            cityId: area.cityId,
            isActive: area.isActive,
            createdAt: area.createdAt,
            updatedAt: area.updatedAt
        }));
    }

    public async listByCityId(cityId: number): Promise<AreaEntity[]> {
        const areas = await this.getRepository().find({
            where: {
                cityId: cityId,
                isActive: true
            }
        });

        return areas.map(area => ({
            id: area.id,
            name: area.name,
            cityId: area.cityId,
            isActive: area.isActive,
            createdAt: area.createdAt,
            updatedAt: area.updatedAt
        }));
    }
}
