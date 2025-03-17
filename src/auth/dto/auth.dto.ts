import { IsString, IsEmail, IsNotEmpty, MinLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class UserInfoDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class RegisterDto {
  @ValidateNested()
  @Type(() => UserInfoDto)
  userInfo: UserInfoDto;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  password: string;
}
