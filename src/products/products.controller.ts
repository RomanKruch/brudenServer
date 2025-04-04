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
  UploadedFiles,
  UseInterceptors,
  ConflictException,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { Types } from 'mongoose';
import { CreateProductDto } from './dto/createProduct.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

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

  @Post()
  @UseGuards(new JwtGuard(JwtStrategy), AdminGuard)
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'smallImg', maxCount: 1 },
      { name: 'largeImg', maxCount: 1 },
    ]),
  )
  async createProduct(
    @UploadedFiles() files: { smallImg?: Express.Multer.File[]; largeImg?: Express.Multer.File[] },
    @Body() createProductDto: CreateProductDto,
  ) {
    const isExist = await this.productsService.getProductByTitle(createProductDto.title);

    if (isExist) {
      throw new ConflictException('Product with same title already exist!');
    }

    const { smallImg, largeImg } = files;

    if (!smallImg || !largeImg) {
      throw new BadRequestException('Small img and large img are required!');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (
      !allowedMimeTypes.includes(smallImg[0].mimetype) ||
      !allowedMimeTypes.includes(largeImg[0].mimetype)
    ) {
      throw new BadRequestException('Images must be a jpeg, png or webp format!');
    }

    const newProduct = await this.productsService.createProduct(
      createProductDto,
      smallImg[0],
      largeImg[0],
    );

    return newProduct;
  }
}
