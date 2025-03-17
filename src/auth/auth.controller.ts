import {
  Controller,
  Post,
  Get,
  Body,
  ConflictException,
  UnauthorizedException,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { compare } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtGuard } from './guards/jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';
import { UsersService } from 'src/users/users.service';
import { UserRequest } from 'src/types/userRequest';

@Controller('auth')
export class AuthController {
  constructor(private jwtService: JwtService, private usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.usersService.findByEmail(registerDto.userInfo.email);

    if (user) {
      throw new ConflictException('Email already here!');
    }

    const newUser = await this.usersService.create(registerDto);

    const secret = process.env.SECRET;
    const token = await this.jwtService.signAsync({ _id: newUser.id }, { secret });

    return await this.usersService.updateToken(newUser.id, token);
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user || !(await compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const secret = process.env.SECRET;
    const token = await this.jwtService.signAsync({ _id: user.id }, { secret });

    return await this.usersService.updateToken(user.id, token);
  }

  @Post('logout')
  @UseGuards(new JwtGuard(JwtStrategy))
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Request() req: UserRequest) {
    await this.usersService.updateToken(req.user.id, null);
    return;
  }

  @Get('refresh')
  @UseGuards(new JwtGuard(JwtStrategy))
  refresh(@Request() req: UserRequest) {
    return req.user;
  }
}
