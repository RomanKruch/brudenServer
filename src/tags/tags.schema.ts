import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false })
export class Tag extends Document {
  @Prop()
  img: string;

  @Prop()
  imgId: string;

  @Prop()
  name: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
