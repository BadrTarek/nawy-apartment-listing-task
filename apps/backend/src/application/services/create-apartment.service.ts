import { Apartment as ApartmentEntity } from "../../domain/entities/apartment.entity";
import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { CreateApartmentDto } from "../dtos/create-apartment.dto";




export class CreateApartmentService {
    constructor(
        private readonly unitOfWork: IUnitOfWork
    ) {}

    async execute(createApartmentDto: CreateApartmentDto): Promise<ApartmentEntity> {
        const apartment = await this.unitOfWork.apartmentRepository.create(createApartmentDto);
        return apartment;
    }
}