export interface ApartmentFilter {
    minPrice?: number;
    maxPrice?: number;
    areaId?: number;
    cityId?: number;
    countryId?: number;
    searchTerm?: string;
    isAvailable?: boolean;
    skip: number;
    take: number;
}
