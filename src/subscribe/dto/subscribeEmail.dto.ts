import { IsEmail, IsNotEmpty } from 'class-validator';

export class SubscribeEmailDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
