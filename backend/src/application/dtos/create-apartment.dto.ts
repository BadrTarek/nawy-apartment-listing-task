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

    @Type(() => Number)
    @IsNumber()
    price: number;

    @Type(() => Number)
    @IsNumber()
    bathrooms: number;

    @Type(() => Number)
    @IsNumber()
    bedrooms: number;

    @Type(() => Number)
    @IsNumber()
    size: number;

    @Type(() => Number)
    @IsNumber()
    areaId: number;

    @IsString()
    @Length(10, 200)
    address: string;

    @Type(() => Number)
    @IsNumber()
    longitude: number;

    @Type(() => Number)
    @IsNumber()
    latitude: number;

    @Type(() => Boolean)
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