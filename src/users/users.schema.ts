import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { genSalt, hash } from 'bcrypt';
import { Product } from 'src/products/products.schema';

@Schema()
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: null })
  token: string | null;

  @Prop({ type: [{ type: Types.ObjectId, ref: Product.name }], default: [] })
  cart: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: Product.name }], default: [] })
  liked: Types.ObjectId[];

  @Prop({ default: 'user' })
  role: 'user' | 'admin';
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const SALT = await genSalt(parseInt(process.env.SALT));
  this.password = await hash(this.password, SALT);
});
