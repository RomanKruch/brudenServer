import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Tag } from 'src/tags/tags.schema';

class ImgRef {
  @Prop()
  ref: string;
  @Prop()
  id: string;
}

class Img {
  @Prop({ type: ImgRef })
  small: ImgRef;
  @Prop({ type: ImgRef })
  large: ImgRef;
}

@Schema({ versionKey: false })
export class Product extends Document {
  @Prop({ type: Img })
  img: Img;

  @Prop()
  title: string;

  @Prop()
  description: string;

  @Prop()
  totalQty: number;

  @Prop()
  price: number;

  @Prop({ type: Types.ObjectId, ref: Tag.name })
  tag: Types.ObjectId;
}

export const ProductSchema = SchemaFactory.createForClass(Product);