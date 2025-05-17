import { Apartment } from "../../entities/apartment.entity";
import { ApartmentFilter } from "../filters/apartment-filter.interface";

export interface IApartmentRepository {
    getById(id: number): Promise<Apartment | null>;
    create(apartment: Apartment): Promise<Apartment>;
    filter(filter: ApartmentFilter): Promise<{ data: Apartment[], total: number }>;
}