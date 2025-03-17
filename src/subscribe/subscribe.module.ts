import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Subscribe, SubscribeSchema } from './subscribe.schema';
import { SubscribeService } from './subscribe.service';
import { SubscribeController } from './subscribe.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Subscribe.name, schema: SubscribeSchema }])],
  controllers: [SubscribeController],
  providers: [SubscribeService],
})
export class SubscribeModule {}
