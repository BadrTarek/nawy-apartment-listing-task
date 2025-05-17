import { City } from "../../../entities/city.entity";
import { IBaseCacheRepository } from "./base-cache-repository.interface";

export interface ICityCacheRepository extends IBaseCacheRepository<City[]> {
    getCitiesByCountry(countryId: number): Promise<City[] | null>;
    setCitiesByCountry(countryId: number, cities: City[]): Promise<void>;
    getCitiesByNameAndCountry(name: string, countryId: number): Promise<City[] | null>;
    setCitiesByNameAndCountry(name: string, countryId: number, cities: City[]): Promise<void>;
}
