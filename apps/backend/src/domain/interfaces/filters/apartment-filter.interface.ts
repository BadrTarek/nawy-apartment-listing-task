import { Sort } from "./sort.interface";

export interface ApartmentFilter {
    minPrice?: number;
    maxPrice?: number;
    areaId?: number;
    cityId?: number;
    countryId?: number;
    searchTerm?: string;
    isAvailable?: boolean;
    bedrooms?: number;
    bathrooms?: number;
    skip: number;
    take: number;
    sort?: Sort;
}
