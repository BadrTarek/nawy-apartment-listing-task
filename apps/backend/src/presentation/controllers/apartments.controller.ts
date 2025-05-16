import { Request, Response, NextFunction } from "express";
import { CreateApartmentService } from "../../application/services/create-apartment.service";
import { CreateApartmentDto } from "../../application/dtos/create-apartment.dto";
import { FilterApartmentsDto } from "../../application/dtos/filter-apartments.dto";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { MediaService } from "../../application/services/media.service";
import { IMediaRepository } from "../../domain/interfaces/repositories/media-repository.interface";
import { FilterApartmentsService } from "../../application/services/filter-apartments.service";
import { ValidationError } from "../../domain/errors/validation.error";
import { UnitOfWork } from "../../data/database/unit-of-work";
import { LocalMediaRepository } from "../../data/media/local-media.repository";
import { DataSource } from "typeorm";

export class ApartmentsController {
    createApartmentService: CreateApartmentService;
    filterApartmentsService: FilterApartmentsService;
    mediaService: MediaService;
    private readonly unitOfWork: IUnitOfWork;
    private readonly mediaRepository: IMediaRepository;

    constructor(
        dataSource: DataSource
    ) {
        this.unitOfWork = new UnitOfWork(dataSource);
        this.mediaRepository = new LocalMediaRepository();

        this.filterApartmentsService = new FilterApartmentsService(this.unitOfWork);
    }

    async create(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            this.mediaService = new MediaService(this.mediaRepository);

            if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
                throw new ValidationError('No files uploaded' as any);
            }

            const urls = await this.mediaService.uploadMultipleImages(req.files);

            // Build the apartment data from the request body
            let apartmentData;
            if (typeof req.body.apartment === 'string') {
                apartmentData = JSON.parse(req.body.apartment);
            } else {
                apartmentData = req.body.apartment;
            }

            // Add the image URLs to the apartment data
            apartmentData.apartmentImages = urls;

            // Transform request body to DTO
            const createApartmentDto = plainToClass(CreateApartmentDto, apartmentData);

            // Validate the DTO
            const errors = await validate(createApartmentDto);
            if (errors.length > 0) {
                throw new ValidationError(errors);
            }

            await this.unitOfWork.beginTransaction();
            this.createApartmentService = new CreateApartmentService(this.unitOfWork);

            // Create apartment using service
            const apartment = await this.createApartmentService.execute(createApartmentDto);

            // Return success response
            res.status(201).json(apartment);
        } catch (error) {
            await this.unitOfWork.rollback();
            next(error);
        }
    }

    async filter(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Transform query parameters to DTO
            const filterDto = plainToClass(FilterApartmentsDto, {
                ...req.query,
                page: parseInt(req.query.page as string) || 1,
                limit: parseInt(req.query.limit as string) || 10
            });

            // Validate the DTO
            const errors = await validate(filterDto);
            if (errors.length > 0) {
                throw new ValidationError(errors);
            }

            await this.unitOfWork.beginTransaction();
            const result = await this.filterApartmentsService.execute(filterDto);

            // Return success response with pagination metadata
            res.json({
                data: result.data,
                meta: {
                    total: result.total,
                    currentPage: filterDto.page,
                    itemsPerPage: filterDto.limit,
                    totalPages: Math.ceil(result.total / filterDto.limit)
                }
            });

            await this.unitOfWork.commit();
        } catch (error) {
            await this.unitOfWork.rollback();
            next(error);
        }
    }
}