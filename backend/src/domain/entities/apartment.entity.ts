
export interface Apartment {
    id?: number;
    title: string;
    description: string;
    price: number;
    size: number;
    bedrooms: number;
    bathrooms: number;
    areaId: number;
    countryName?: string;
    cityName?: string;
    areaName?: string;
    currency?: string;
    images?: string[];
    features?: {
        name: string;
        value: string;
    }[];
    address: string;
    longitude: number;
    latitude: number;
    isAvailable: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}