import { IsOptional, IsNumber, IsString, IsBoolean } from 'class-validator';

export class FilterApartmentsDto {
    @IsOptional()
    @IsNumber()
    minPrice?: number;

    @IsOptional()
    @IsNumber()
    maxPrice?: number;

    @IsOptional()
    @IsNumber()
    areaId?: number;

    @IsOptional()
    @IsNumber()
    cityId?: number;

    @IsOptional()
    @IsNumber()
    countryId?: number;

    @IsOptional()
    @IsString()
    searchTerm?: string;

    @IsOptional()
    @IsBoolean()
    isAvailable?: boolean;

    @IsOptional()
    @IsNumber()
    page: number = 1;

    @IsOptional()
    @IsNumber()
    limit: number = 10;
}
