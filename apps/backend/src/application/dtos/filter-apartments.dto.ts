import { Type } from 'class-transformer';
import { IsOptional, IsNumber, IsString, IsBoolean, IsEnum, ValidateNested } from 'class-validator';
import { Sort } from '../../domain/interfaces/filters/sort.interface';

export class SortDto implements Sort {
    @IsString()
    @IsEnum(['price', 'createdAt', 'size', 'bedrooms', 'bathrooms'])
    field: string;

    @IsString()
    @IsEnum(['ASC', 'DESC'])
    order: 'ASC' | 'DESC';
}

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
    @ValidateNested()
    @Type(() => SortDto)
    sort?: SortDto;
}
