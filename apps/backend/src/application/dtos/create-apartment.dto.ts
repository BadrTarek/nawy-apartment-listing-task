import { IsString, Length, IsNumber, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// Helper DTO for feature validation
class FeatureDto {
    @IsNumber()
    featureId: number;

    @IsString()
    @Length(1, 200)
    value: string;
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
    areaId: number;

    @IsString()
    @Length(10, 200)
    address: string;

    @IsBoolean()
    isAvailable: boolean;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => FeatureDto)
    features: FeatureDto[];
}