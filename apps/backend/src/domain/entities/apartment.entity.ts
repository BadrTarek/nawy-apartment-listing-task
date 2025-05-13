
export interface Apartment {
    id: number;
    title: string;
    description: string;
    price: number;
    areaId: number;
    address: string;
    isAvailable: boolean;
    createdAt: Date;
    updatedAt?: Date;
}