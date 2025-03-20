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
import { ProductsService } from 'src/products/products.service';
import { Types } from 'mongoose';
import { ChangePasswordDto, UpdateUserDto } from './dto/user.dto';
import { compare, genSalt, hash } from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService, private productsService: ProductsService) {}

  // @Patch()
  // @UseGuards(new JwtGuard(JwtStrategy))
  // async updateUser(@Req() req: UserRequest, @Body() updateUserDto: UpdateUserDto) {
  //   if (updateUserDto.email && updateUserDto.email !== req.user.email) {
  //     const existingUser = await this.usersService.findByEmail(updateUserDto.email);
  //     if (existingUser) {
  //       throw new ConflictException('Email already here!');
  //     }
  //   }

  //   const updatedUser = await this.usersService.update(req.user.id, updateUserDto);

  //   return updatedUser;
  // }

  // @Patch('changePassword')
  // @UseGuards(new JwtGuard(JwtStrategy))
  // async changePassword(@Req() req: UserRequest, @Body() dto: ChangePasswordDto) {
  //   const currentPassword = await this.usersService.getPassword(req.user.id);
  //   const isPasswordValid = await compare(dto.oldPassword, currentPassword);
  //   if (!isPasswordValid) {
  //     throw new UnauthorizedException('Invalid password');
  //   }

  //   const SALT = await genSalt(parseInt(process.env.SALT));
  //   const hashedPassword = await hash(dto.newPassword, SALT);
  //   await this.usersService.updatePassword(req.user.id, hashedPassword);

  //   return { message: 'Password changed successfully' };
  // }

  @Post('like/:productId')
  @UseGuards(new JwtGuard(JwtStrategy))
  async toggleLike(@Req() req: UserRequest, @Param('productId') productId: string) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product ID format');
    }

    const isInLiked = req.user.liked.some(product => product._id.toString() === productId);

    if (isInLiked) {
      const res = await this.usersService.removeFromLiked(req.user, productId);
      return {
        id: res,
      };
    } else {
      const res = await this.usersService.addToLiked(req.user, productId);
      const product = await this.productsService.getProductById(res);
      return product;
    }
  }

  @Post('cart/:productId')
  @UseGuards(new JwtGuard(JwtStrategy))
  async toggleCart(@Req() req: UserRequest, @Param('productId') productId: string) {
    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product ID format');
    }

    const isInCart = req.user.cart.some(product => product._id.toString() === productId);

    if (isInCart) {
      const res = await this.usersService.removeFromCart(req.user, productId);
      return {
        id: res,
      };
    } else {
      const res = await this.usersService.addToCart(req.user, productId);
      const product = await this.productsService.getProductById(res);
      return product;
    }
  }


  // @Delete('deleteAccount')
  // @UseGuards(new JwtGuard(JwtStrategy))
  // async deleteAccount(@Req() req: UserRequest) {
  //   await this.usersService.deleteUser(req.user.id);
  //   return { message: 'Account deleted successfully' };
  // }
}
