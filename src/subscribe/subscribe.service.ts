import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscribe } from './subscribe.schema';

@Injectable()
export class SubscribeService {
  constructor(@InjectModel(Subscribe.name) private subscribeModel: Model<Subscribe>) {}

  async addSubscriber(email: string) {
    const existing = await this.subscribeModel.findOne({ email }).exec();
    if (existing) {
      throw new ConflictException('You are already subscribed!');
    }
    const subscriber = new this.subscribeModel({ email });
    await subscriber.save();
    return { message: 'Successfully subscribed!' };
  }

  async getAllSubscribers() {
    return this.subscribeModel.find().exec();
  }
}
