import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { Country } from "../../domain/entities/country.entity";
import { ICountryCacheRepository } from "../../domain/interfaces/repositories/cache/country-cache-repository.interface";

export class CountryService {

    constructor(
        private readonly unitOfWork: IUnitOfWork,
        private readonly cacheRepository: ICountryCacheRepository
    ) { }

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
