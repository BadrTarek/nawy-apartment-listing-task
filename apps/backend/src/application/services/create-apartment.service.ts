import { Apartment as ApartmentEntity } from "../../domain/entities/apartment.entity";
import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { CreateApartmentDto } from "../dtos/create-apartment.dto";
import { ApartmentFeatureMapping } from '../../domain/entities/apartment-feature-mapping.entity';




export class CreateApartmentService {
    constructor(
        private readonly unitOfWork: IUnitOfWork
    ) { }

    async execute(createApartmentDto: CreateApartmentDto): Promise<ApartmentEntity> {
        const apartment = await this.unitOfWork.apartmentRepository.create(createApartmentDto);
        const apartmentFeatureMappings = createApartmentDto.features.map(feature => {
            return {
                apartmentId: apartment.id,
                featureId: feature.featureId,
                featureValue: feature.featureValue
            };
        });
        await this.unitOfWork.apartmentFeatureMappingRepository.bulkCreate(apartmentFeatureMappings as ApartmentFeatureMapping[]);
        return apartment;
    }
}