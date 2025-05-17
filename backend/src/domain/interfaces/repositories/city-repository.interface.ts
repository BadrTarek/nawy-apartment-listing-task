import { City } from "../../entities/city.entity";

export interface ICityRepository {
    searchByName(name: string, countryId: number): Promise<City[]>;
    listByCountryId(countryId: number): Promise<City[]>;
}