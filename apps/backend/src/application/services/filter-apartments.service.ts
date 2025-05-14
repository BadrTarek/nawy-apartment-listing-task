import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { Apartment } from "../../domain/entities/apartment.entity";
import { FilterApartmentsDto } from "../dtos/filter-apartments.dto";
import { ApartmentFilter } from "../../domain/interfaces/filters/apartment-filter.interface";

export class FilterApartmentsService {
    constructor(private readonly unitOfWork: IUnitOfWork) { }

    private mapDtoToDomainFilter(dto: FilterApartmentsDto): ApartmentFilter {
        return {
            minPrice: dto.minPrice,
            maxPrice: dto.maxPrice,
            areaId: dto.areaId,
            cityId: dto.cityId,
            countryId: dto.countryId,
            searchTerm: dto.searchTerm,
            isAvailable: dto.isAvailable,
            skip: (dto.page - 1) * dto.limit,
            take: dto.limit
        };
    }

    async execute(filterDto: FilterApartmentsDto): Promise<{ data: Apartment[], total: number }> {
        const filter = this.mapDtoToDomainFilter(filterDto);
        return this.unitOfWork.apartmentRepository.filter(filter);
    }
}
