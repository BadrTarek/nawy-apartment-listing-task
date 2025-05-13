import { IApartmentRepository } from "../../domain/interfaces/repositories/apartment-repository.interface";
import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";



export class UnitOfWork implements IUnitOfWork {
    apartmentRepository: IApartmentRepository = {} as IApartmentRepository;

    commit(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    rollback(): Promise<void> {
        throw new Error("Method not implemented.");
    }
}