import {
  BadRequestException,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserRequest } from 'src/types/userRequest';
import { ProductsService } from 'src/products/products.service';
import { Types } from 'mongoose';
import { AdminGuard } from 'src/auth/guards/admin.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService, private productsService: ProductsService) {}
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

  @Get('isAdmin')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(new JwtGuard(JwtStrategy), AdminGuard)
  async isAdmin() {
    return;
  }
}
