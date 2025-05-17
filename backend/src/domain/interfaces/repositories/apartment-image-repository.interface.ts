import { ApartmentImage } from "../../entities/apartment-image.entity";

export interface IApartmentImageRepository {
    bulkCreate(images: ApartmentImage[]): Promise<ApartmentImage[]>;
}
