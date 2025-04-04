import { IsNotEmpty } from 'class-validator';

export class CreateTagDto {
  @IsNotEmpty({ message: 'Name is required!' })
  name: string;
}
