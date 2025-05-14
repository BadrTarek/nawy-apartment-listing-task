import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { Country } from "../../domain/entities/country.entity";

export class CountryService {
    constructor(private readonly unitOfWork: IUnitOfWork) { }

    async searchByName(name: string): Promise<Country[]> {
        return this.unitOfWork.countryRepository.searchByName(name);
    }

    async list(): Promise<Country[]> {
        return this.unitOfWork.countryRepository.list();
    }
}
