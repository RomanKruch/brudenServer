import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;
}

export class ChangePasswordDto {
  @IsString()
  @MinLength(8)
  oldPassword: string;

  @IsString()
  @MinLength(8)
  newPassword: string;
}
