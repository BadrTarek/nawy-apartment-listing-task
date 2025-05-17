import { Apartment as ApartmentEntity } from "../../domain/entities/apartment.entity";
import { IUnitOfWork } from "../../domain/interfaces/unit-of-work.interface";
import { CreateApartmentDto } from "../dtos/create-apartment.dto";
import { ApartmentFeatureMapping } from '../../domain/entities/apartment-feature-mapping.entity';
import { ApartmentImage as ApartmentImageEntity } from "../../domain/entities/apartment-image.entity";




export class CreateApartmentService {
    constructor(
        private readonly unitOfWork: IUnitOfWork
    ) { }

    async execute(createApartmentDto: CreateApartmentDto): Promise<ApartmentEntity> {
        const apartment = await this.unitOfWork.apartmentRepository.create({
            title: createApartmentDto.title,
            description: createApartmentDto.description,
            price: createApartmentDto.price,
            size: createApartmentDto.size,
            bedrooms: createApartmentDto.bedrooms,
            bathrooms: createApartmentDto.bathrooms,
            address: createApartmentDto.address,
            longitude: createApartmentDto.longitude,
            latitude: createApartmentDto.latitude,
            areaId: createApartmentDto.areaId,
            isAvailable: true
        } as ApartmentEntity);
        const apartmentFeatureMappings = createApartmentDto.features.map(feature => {
            return {
                apartmentId: apartment.id,
                featureId: feature.featureId,
                featureValue: feature.featureValue
            };
        });
        await this.unitOfWork.apartmentFeatureMappingRepository.bulkCreate(apartmentFeatureMappings as ApartmentFeatureMapping[]);
        await this.unitOfWork.apartmentImageRepository.bulkCreate(
            createApartmentDto.apartmentImages.map(image => ({
                apartmentId: apartment.id,
                url: image,
                isActive: true
            })) as ApartmentImageEntity[]
        );
        return apartment;
    }
}