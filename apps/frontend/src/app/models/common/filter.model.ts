export type SortField = 'price' | 'createdAt' | 'size' | 'bedrooms' | 'bathrooms';
export type SortOrder = 'ASC' | 'DESC';

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
    sortBy?: SortField;
    sortOrder?: SortOrder;
}
export interface FilterMeta {
    total: number;
    currentPage: number;
    itemsPerPage: number;
    totalPages: number;
}
