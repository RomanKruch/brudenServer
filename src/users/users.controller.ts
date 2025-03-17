import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Param,
  Post,
  Patch,
  Req,
  UseGuards,
  UnauthorizedException,
  Delete,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserRequest } from 'src/types/userRequest';
import { ToursService } from 'src/products/products.service';
import { Types } from 'mongoose';
import { ChangePasswordDto, UpdateUserDto } from './dto/user.dto';
import { compare, genSalt, hash } from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService, private toursService: ToursService) {}

  @Patch()
  @UseGuards(new JwtGuard(JwtStrategy))
  async updateUser(@Req() req: UserRequest, @Body() updateUserDto: UpdateUserDto) {
    if (updateUserDto.email && updateUserDto.email !== req.user.email) {
      const existingUser = await this.usersService.findByEmail(updateUserDto.email);
      if (existingUser) {
        throw new ConflictException('Email already here!');
      }
    }

    const updatedUser = await this.usersService.update(req.user.id, updateUserDto);

    return updatedUser;
  }

  @Patch('changePassword')
  @UseGuards(new JwtGuard(JwtStrategy))
  async changePassword(@Req() req: UserRequest, @Body() dto: ChangePasswordDto) {
    const currentPassword = await this.usersService.getPassword(req.user.id);
    const isPasswordValid = await compare(dto.oldPassword, currentPassword);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const SALT = await genSalt(parseInt(process.env.SALT));
    const hashedPassword = await hash(dto.newPassword, SALT);
    await this.usersService.updatePassword(req.user.id, hashedPassword);

    return { message: 'Password changed successfully' };
  }

  @Post('like/:tourId')
  @UseGuards(new JwtGuard(JwtStrategy))
  async toggleLike(@Req() req: UserRequest, @Param('tourId') tourId: string) {
    if (!Types.ObjectId.isValid(tourId)) {
      throw new BadRequestException('Invalid tour ID format');
    }

    const isInLiked = req.user.liked.some(tour => tour._id.toString() === tourId);

    if (isInLiked) {
      const res = await this.usersService.removeFromLiked(req.user, tourId);
      return {
        id: res,
      };
    } else {
      const res = await this.usersService.addToLiked(req.user, tourId);
      const tour = await this.toursService.getTourById(res);
      return tour;
    }
  }

  @Delete('deleteAccount')
  @UseGuards(new JwtGuard(JwtStrategy))
  async deleteAccount(@Req() req: UserRequest) {
    await this.usersService.deleteUser(req.user.id);
    return { message: 'Account deleted successfully' };
  }
}
