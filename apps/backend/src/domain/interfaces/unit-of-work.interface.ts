import { IApartmentRepository } from "./repositories/apartment-repository.interface";



export interface IUnitOfWork {
    // Repositories
    apartmentRepository: IApartmentRepository;
    
    // Methods
    beginTransaction(): Promise<void> 
    commit(): Promise<void>;
    rollback(): Promise<void>;
}