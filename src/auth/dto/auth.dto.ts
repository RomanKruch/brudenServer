import { IsNotEmpty, MinLength, Validate } from 'class-validator';
import { CustomEmailValidator } from 'src/helpers/customEmailValidation';

export class RegisterDto {
  @IsNotEmpty({ message: 'Name is required!' })
  name: string;

  @IsNotEmpty({ message: 'Email is required!' })
  @Validate(CustomEmailValidator)
  email: string;

  @IsNotEmpty({ message: 'Password is required!' })
  @MinLength(8, { message: 'Password length must be 8 or more!' })
  password: string;
}

export class LoginDto {
  @IsNotEmpty({ message: 'Email is required!' })
  @Validate(CustomEmailValidator)
  email: string;

  @IsNotEmpty({ message: 'Password is required!' })
  @MinLength(8, { message: 'Password length must be 8 or more!' })
  password: string;
}
