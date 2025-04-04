import { IsNumber, Min, Max, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @IsNotEmpty({ message: 'Title is required!' })
  title: string;

  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'Price must be a number!' })
  @Min(0, { message: "Price mustn't be less 0!" })
  price: number;

  @IsNotEmpty({ message: 'Description is required!' })
  description: string;

  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'Quantity must be a number!' })
  @Min(0, { message: "Quantity mustn't be less 0!" })
  totalQty: number;

  @Transform(({ value }) => Number(value))
  @IsNumber({}, { message: 'Rating must be a number!' })
  @Min(0, { message: "Rating mustn't be less 0!" })
  @Max(5, { message: "Rating mustn't be more 5!" })
  rating: number;

  @IsNotEmpty({ message: 'Tag is required!' })
  tag: string;
}
