import { Apartment } from "../../entities/apartment.entity";


export interface IApartmentRepository {
    list(): Promise<Apartment[]>;
    getById(id: number): Promise<Apartment | null>;
    create(apartment: Apartment): Promise<Apartment>;
}