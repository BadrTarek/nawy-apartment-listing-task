import { ICityCacheRepository } from '../../domain/interfaces/repositories/cache/city-cache-repository.interface';
import { BaseRedisCache } from './base-redis.cache';
import { City as CityEntity } from '../database/models';
import Redis from 'ioredis';

export class CityRedisCache extends BaseRedisCache<CityEntity[]> implements ICityCacheRepository {
    constructor(redis: Redis) {
        super(redis, 'city');
    }

    async getCitiesByCountry(countryId: number): Promise<CityEntity[] | null> {
        return this.get(`country:${countryId}`);
    }

    async setCitiesByCountry(countryId: number, cities: CityEntity[]): Promise<void> {
        await this.set(`country:${countryId}`, cities);
    }

    async getCitiesByNameAndCountry(name: string, countryId: number): Promise<CityEntity[] | null> {
        return this.get(`search:${countryId}:${name}`);
    }

    async setCitiesByNameAndCountry(name: string, countryId: number, cities: CityEntity[]): Promise<void> {
        await this.set(`search:${countryId}:${name}`, cities);
    }
}
