import { IApartmentRepository } from "./repositories/apartment-repository.interface";



export interface IUnitOfWork {
    // Repositories
    apartmentRepository: IApartmentRepository;
    
    // Methods
    commit(): Promise<void>;
    rollback(): Promise<void>;
}