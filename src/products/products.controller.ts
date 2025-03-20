import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserRequest } from 'src/types/userRequest';
import { TourDto } from './dto/tour.dto';
import { Types } from 'mongoose';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { UsersService } from 'src/users/users.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  async getProducts(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortByDesc') sortByDesc?: string,
    @Query('filter') filter?: string,
    @Query('tags') tags?: string,
  ) {
    const res = await this.productsService.getProducts({
      limit: limit ? Number(limit) : 6,
      page: page ? Number(page) : 1,
      sortBy,
      sortByDesc,
      filter,
      tags,
    });

    return res;
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid product ID format');
    }

    const product = await this.productsService.getProductById(new Types.ObjectId(id));

    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // @Post()
  // @UseGuards(new JwtGuard(JwtStrategy), AdminGuard)
  // async createTour(@Body() tourDto: TourDto) {
  //   const newTour = await this.toursService.create(tourDto);
  //   return {
  //     newTour,
  //   };
  // }

  // @Post('arr')
  // @UseGuards(new JwtGuard(JwtStrategy), AdminGuard)
  // async createToursArr(@Body() toursDto: TourDto[]) {
  //   const createdTours = await Promise.all(
  //     toursDto.map(async item => {
  //       return this.toursService.create(item);
  //     }),
  //   );

  //   return createdTours;
  // }
}
