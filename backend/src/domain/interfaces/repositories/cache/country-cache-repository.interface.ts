import { Country } from "../../../entities/country.entity";
import { IBaseCacheRepository } from "./base-cache-repository.interface";

export interface ICountryCacheRepository extends IBaseCacheRepository<Country[]> {
    getCountries(): Promise<Country[] | null>;
    setCountries(countries: Country[]): Promise<void>;
    getCountryByName(name: string): Promise<Country[] | null>;
    setCountryByName(name: string, countries: Country[]): Promise<void>;
}
