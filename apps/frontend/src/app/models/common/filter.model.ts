
export interface ApartmentFilters {
    minPrice?: number;
    maxPrice?: number;
    areaId?: number;
    cityId?: number;
    countryId?: number;
    searchTerm?: string;
    isAvailable?: boolean;
    bedrooms?: number;
    bathrooms?: number;
    page: number;
    limit: number;
}
export interface FilterMeta {
    total: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
}
