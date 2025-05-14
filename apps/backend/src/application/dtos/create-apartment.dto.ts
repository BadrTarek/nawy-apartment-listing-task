import { IsString, Length, IsNumber, IsBoolean } from 'class-validator';


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
}