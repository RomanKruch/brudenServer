import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './users.schema';
import { ProductsService } from 'src/products/products.service';
import { Product,ProductSchema } from 'src/products/products.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, ProductsService],
  exports: [UsersService],
})
export class UsersModule {}
