import { Country } from "../../entities/country.entity";

export interface ICountryRepository {
    searchByName(name: string): Promise<Country[]>;
    list(): Promise<Country[]>;
}