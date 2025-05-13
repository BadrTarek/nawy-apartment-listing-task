
export interface City {
    id: number;
    name: string;
    countryId: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
}