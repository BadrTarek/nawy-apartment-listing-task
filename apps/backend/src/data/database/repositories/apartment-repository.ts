import { IApartmentRepository } from "../../../domain/interfaces/repositories/apartment-repository.interface";
import { Apartment } from "../../../domain/entities/apartment.entity";


export class ApartmentRepository implements IApartmentRepository {
    list(): Promise<Apartment[]> {
        throw new Error("Method not implemented.");
    }
    getById(id: string): Promise<Apartment | null> {
        throw new Error("Method not implemented.");
    }
    create(apartment: Apartment): Promise<Apartment> {
        throw new Error("Method not implemented.");
    }
}