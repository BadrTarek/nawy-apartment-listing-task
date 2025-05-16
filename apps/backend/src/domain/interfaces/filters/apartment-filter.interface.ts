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
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
}
