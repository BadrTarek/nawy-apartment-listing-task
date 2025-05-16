import { IsString, Length, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Helper DTO for feature validation
class FeatureDto {
    @IsNumber()
    featureId: number;

    @IsString()
    @Length(1, 200)
    featureValue: string;
}

/**
 * DTO for creating an apartment
 */
export class CreateApartmentDto {

    @IsString()
    @Length(3, 100)
    title: string;

    @IsString()
    @Length(10, 500)
    description: string;

    @IsNumber()
    price: number;

    @IsNumber()
    bathrooms: number;

    @IsNumber()
    bedrooms: number;

    @IsNumber()
    size: number;

    @IsNumber()
    areaId: number;

    @IsString()
    @Length(10, 200)
    address: string;

    @IsNumber()
    longitude: number;

    @IsNumber()
    latitude: number;

    @IsBoolean()
    isAvailable: boolean;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FeatureDto)
    features: FeatureDto[];

    @IsArray()
    @IsString({ each: true })
    apartmentImages: string[];
}