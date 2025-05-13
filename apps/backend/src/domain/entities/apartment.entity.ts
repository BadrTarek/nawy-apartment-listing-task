import { Currency } from '../enums/currency.enum';

export interface Apartment {
    id: number;
    title: string;
    description: string;
    price: number;
    currency: Currency;
    areaId: number;
    address: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt?: Date;
}