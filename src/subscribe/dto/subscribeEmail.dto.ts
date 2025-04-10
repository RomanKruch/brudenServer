import { IsNotEmpty, Validate } from 'class-validator';
import { CustomEmailValidator } from 'src/helpers/customEmailValidation';

export class SubscribeEmailDto {
  @IsNotEmpty({ message: 'Email is required!' })
  @Validate(CustomEmailValidator)
  email: string;
}
