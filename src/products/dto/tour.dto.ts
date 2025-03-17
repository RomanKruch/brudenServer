import { IsString, IsNumber, IsNotEmpty, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class Cords {
  @IsNumber()
  lat: number;

  @IsNumber()
  lng: number;
}

export class TourDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsUrl()
  @IsNotEmpty()
  photo: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsNumber()
  @IsNotEmpty()
  price: number;

  @ValidateNested()
  @Type(() => Cords)
  cords: Cords;
}
