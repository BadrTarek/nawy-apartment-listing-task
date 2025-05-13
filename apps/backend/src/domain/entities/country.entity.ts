
export interface Country {
    id: number;
    name: string;
    currency: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt?: Date;
}