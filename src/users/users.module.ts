import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User, UserSchema } from './users.schema';
import { ToursService } from 'src/products/products.service';
import { Tour, TourSchema } from 'src/products/products.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Tour.name, schema: TourSchema }]),
  ],
  controllers: [UsersController],
  providers: [UsersService, ToursService],
  exports: [UsersService],
})
export class UsersModule {}
