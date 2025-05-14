import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { City } from "../../domain/entities/city.entity";

export class CityService {
    constructor(private readonly unitOfWork: IUnitOfWork) { }

    async searchByName(name: string, countryId: number): Promise<City[]> {
        return this.unitOfWork.cityRepository.searchByName(name, countryId);
    }

    async listByCountryId(countryId: number): Promise<City[]> {
        return this.unitOfWork.cityRepository.listByCountryId(countryId);
    }
}
