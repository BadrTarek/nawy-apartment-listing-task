import { Apartment } from "../../entities/apartment.entity";


export interface IApartmentRepository {
    list(): Promise<Apartment[]>;
    getById(id: string): Promise<Apartment | null>;
    create(apartment: Apartment): Promise<Apartment>;
}