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
    @Query('page') page = 1,
    @Query('limit') limit = 6,
    @Query('price') price?: string,
    @Query('title') title?: string,
    @Query('location') location?: string,
  ) {
    const filters = {
      price: price ? Number(price) : undefined,
      title,
      location,
    };

    return this.toursService.getTours(+page, +limit, filters);
  }

  @Get(':id')
  async getProductById(@Param('id') id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException('Invalid tour ID format');
    }

    const tour = await this.toursService.getTourById(new Types.ObjectId(id));

    if (!tour) {
      throw new NotFoundException('Tour not found');
    }
    return tour;
  }

  @Post()
  @UseGuards(new JwtGuard(JwtStrategy), AdminGuard)
  async createTour(@Body() tourDto: TourDto) {
    const newTour = await this.toursService.create(tourDto);
    return {
      newTour,
    };
  }

  @Post('arr')
  @UseGuards(new JwtGuard(JwtStrategy), AdminGuard)
  async createToursArr(@Body() toursDto: TourDto[]) {
    const createdTours = await Promise.all(
      toursDto.map(async item => {
        return this.toursService.create(item);
      }),
    );

    return createdTours;
  }
}
