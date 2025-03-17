import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true, versionKey: false })
export class Subscribe extends Document {
  @Prop({ required: true, unique: true })
  email: string;
}

export const SubscribeSchema = SchemaFactory.createForClass(Subscribe);
