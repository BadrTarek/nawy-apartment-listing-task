import { Request, Response } from "express";
import { CreateApartmentService } from "../../application/services/create-apartment.service";
import { CreateApartmentDto } from "../../application/dtos/create-apartment.dto";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";

export class ApartmentsController {
    createApartmentService: CreateApartmentService;

    constructor(
        private readonly unitOfWork: IUnitOfWork
    ) {
        
     }

    async create(req: Request, res: Response): Promise<void> {
        try {
            // Transform request body to DTO
            const createApartmentDto = plainToClass(CreateApartmentDto, req.body);

            // Validate the DTO
            const errors = await validate(createApartmentDto);
            if (errors.length > 0) {
                res.status(400).json({
                    message: 'Validation failed',
                    errors: errors.map(error => ({
                        property: error.property,
                        constraints: error.constraints
                    }))
                });
                return;
            }
            await this.unitOfWork.beginTransaction();

            this.createApartmentService = new CreateApartmentService(this.unitOfWork);

            // Create apartment using service
            const apartment = await this.createApartmentService.execute(createApartmentDto);

            // Return success response
            res.status(201).json(apartment);
        } catch (error) {
            res.status(500).json({
                message: 'Error creating apartment',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        } finally{
            // Ensure transaction is committed or rolled back
            try {
                await this.unitOfWork.commit();
            } catch (error) {
                await this.unitOfWork.rollback();
                console.error("Transaction rollback due to error:", error);
            }
        }
    }
}