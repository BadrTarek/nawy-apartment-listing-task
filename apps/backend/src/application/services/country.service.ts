import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { Country } from "../../domain/entities/country.entity";
import { ICountryCacheRepository } from "../../domain/interfaces/repositories/cache/country-cache-repository.interface";
import { RedisConnectionFactory } from "../../data/cache/redis-connection.factory";
import { CountryRedisCache } from "../../data/cache/country-redis.cache";

export class CountryService {
    private readonly cacheRepository: ICountryCacheRepository;

    constructor(private readonly unitOfWork: IUnitOfWork) {
        const redis = RedisConnectionFactory.getConnection();
        this.cacheRepository = new CountryRedisCache(redis);
    }

    async searchByName(name: string): Promise<Country[]> {
        // Try to get from cache first
        const cachedCountries = await this.cacheRepository.getCountryByName(name);
        if (cachedCountries) {
            return cachedCountries;
        }

        // If not in cache, get from database
        const countries = await this.unitOfWork.countryRepository.searchByName(name);

        // Store in cache for future requests
        await this.cacheRepository.setCountryByName(name, countries);

        return countries;
    }

    async list(): Promise<Country[]> {
        // Try to get from cache first
        const cachedCountries = await this.cacheRepository.getCountries();
        if (cachedCountries) {
            return cachedCountries;
        }

        // If not in cache, get from database
        const countries = await this.unitOfWork.countryRepository.list();

        // Store in cache for future requests
        await this.cacheRepository.setCountries(countries);

        return countries;
    }
}
