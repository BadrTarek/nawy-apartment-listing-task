import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsBoolean, IsEnum } from 'class-validator';

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

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    bedrooms?: number;

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    bathrooms?: number;

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

    @IsOptional()
    @IsString()
    @IsEnum(['price', 'createdAt', 'size', 'bedrooms', 'bathrooms'])
    sortBy?: string;

    @IsOptional()
    @IsString()
    @IsEnum(['ASC', 'DESC'])
    sortOrder?: 'ASC' | 'DESC';
}
