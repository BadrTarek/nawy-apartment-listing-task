
export interface Area {
    id: number;
    name: string;
    cityId: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
}