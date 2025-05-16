import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';

export class FilterApartmentsDto {
    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    minPrice?: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    maxPrice?: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    areaId?: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    cityId?: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    countryId?: number;

    @IsOptional()
    @IsString()
    searchTerm?: string;

    @Type(() => Boolean)
    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    page: number = 1;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    limit: number = 10;
}
