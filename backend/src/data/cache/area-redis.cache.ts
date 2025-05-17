import Redis from 'ioredis';
import { BaseRedisCache } from './base-redis.cache';
import { IAreaCacheRepository } from '../../domain/interfaces/repositories/cache/area-cache-repository.interface';
import { Area as AreaEntity } from '../../domain/entities/area.entity';

export class AreaRedisCache extends BaseRedisCache<AreaEntity[]> implements IAreaCacheRepository {
    constructor(redis: Redis) {
        super(redis, 'area');
    }

    async getAreasByCity(cityId: number): Promise<AreaEntity[] | null> {
        return this.get(`city:${cityId}`);
    }

    async setAreasByCity(cityId: number, areas: AreaEntity[]): Promise<void> {
        await this.set(`city:${cityId}`, areas);
    }

    async getAreasByNameAndCity(name: string, cityId: number): Promise<AreaEntity[] | null> {
        return this.get(`search:${cityId}:${name}`);
    }

    async setAreasByNameAndCity(name: string, cityId: number, areas: AreaEntity[]): Promise<void> {
        await this.set(`search:${cityId}:${name}`, areas);
    }
}
