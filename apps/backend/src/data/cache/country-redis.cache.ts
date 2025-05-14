import { ICountryCacheRepository } from '../../domain/interfaces/repositories/cache/country-cache-repository.interface';
import { BaseRedisCache } from './base-redis.cache';
import { Country as CountryEntity } from '../database/models';
import Redis from 'ioredis';

export class CountryRedisCache extends BaseRedisCache<CountryEntity[]> implements ICountryCacheRepository {
    constructor(redis: Redis) {
        super(redis, 'country');
    }

    async getCountries(): Promise<CountryEntity[] | null> {
        return this.get('all');
    }

    async setCountries(countries: CountryEntity[]): Promise<void> {
        await this.set('all', countries);
    }

    async getCountryByName(name: string): Promise<CountryEntity[] | null> {
        return this.get(`search:${name}`);
    }

    async setCountryByName(name: string, countries: CountryEntity[]): Promise<void> {
        await this.set(`search:${name}`, countries);
    }
}
