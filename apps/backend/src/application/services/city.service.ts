import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { City } from "../../domain/entities/city.entity";
import { ICityCacheRepository } from "../../domain/interfaces/repositories/cache/city-cache-repository.interface";
import { RedisConnectionFactory } from "../../data/cache/redis-connection.factory";
import { CityRedisCache } from "../../data/cache/city-redis.cache";

export class CityService {
    private readonly cacheRepository: ICityCacheRepository;

    constructor(private readonly unitOfWork: IUnitOfWork) {
        const redis = RedisConnectionFactory.getConnection();
        this.cacheRepository = new CityRedisCache(redis);
    }

    async searchByName(name: string, countryId: number): Promise<City[]> {
        // Try to get from cache first
        const cachedCities = await this.cacheRepository.getCitiesByNameAndCountry(name, countryId);
        if (cachedCities) {
            return cachedCities;
        }

        // If not in cache, get from database
        const cities = await this.unitOfWork.cityRepository.searchByName(name, countryId);

        // Store in cache for future requests
        await this.cacheRepository.setCitiesByNameAndCountry(name, countryId, cities);

        return cities;
    }

    async listByCountryId(countryId: number): Promise<City[]> {
        // Try to get from cache first
        const cachedCities = await this.cacheRepository.getCitiesByCountry(countryId);
        if (cachedCities) {
            return cachedCities;
        }

        // If not in cache, get from database
        const cities = await this.unitOfWork.cityRepository.listByCountryId(countryId);

        // Store in cache for future requests
        await this.cacheRepository.setCitiesByCountry(countryId, cities);

        return cities;
    }
}
