import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './products.schema';
import { UsersService } from 'src/users/users.service';
import { User, UserSchema } from 'src/users/users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [ProductsController],
  providers: [ProductsService, UsersService],
  exports: [ProductsService],
})
export class ProductsModule {}
