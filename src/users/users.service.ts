import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './users.schema';
import { RegisterDto } from 'src/auth/dto/auth.dto';
import { UpdateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async findById(id: Types.ObjectId) {
    return await this.userModel
      .findById(id)
      .select('-password')
      .populate({
        path: 'liked',
        model: 'Product',
      })
      .populate({
        path: 'cart',
        model: 'Product',
      })
      .exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async getPassword(id: Types.ObjectId) {
    return (await this.userModel.findById(id)).password;
  }

  async create(userBody: RegisterDto) {
    const newUser = new this.userModel(userBody);
    return newUser.save();
  }

  // async update(id: Types.ObjectId, userInfo: UpdateUserDto) {
  //   return this.userModel
  //     .findByIdAndUpdate(
  //       id,
  //       { userInfo },
  //       {
  //         new: true,
  //         runValidators: true,
  //       },
  //     )
  //     .select('-password')
  //     .populate({
  //       path: 'liked',
  //       model: 'Product',
  //     })
  //     .populate({
  //       path: 'cart',
  //       model: 'Product',
  //     })
  //     .exec();
  // }

  async updateToken(id: Types.ObjectId, token: string | null) {
    return await this.userModel
      .findByIdAndUpdate(
        id,
        { token },
        {
          new: true,
          runValidators: true,
        },
      )
      .select('-password')
      .populate({
        path: 'liked',
        model: 'Product',
      })
      .populate({
        path: 'cart',
        model: 'Product',
      })
      .exec();
  }

  // async updatePassword(id: Types.ObjectId, password: string) {
  //   return this.userModel.findByIdAndUpdate(id, { password });
  // }

  async addToLiked(user: User, productId: string) {
    await this.userModel.findByIdAndUpdate(user._id, {
      liked: [...user.liked, new Types.ObjectId(productId)],
    });
    return new Types.ObjectId(productId);
  }

  async removeFromLiked(user: User, productId: string) {
    await this.userModel.findByIdAndUpdate(user._id, {
      liked: user.liked.filter(product => product._id.toString() !== productId),
    });
    return productId;
  }

  async addToCart(user: User, productId: string) {
    await this.userModel.findByIdAndUpdate(user._id, {
      cart: [...user.cart, new Types.ObjectId(productId)],
    });
    return new Types.ObjectId(productId);
  }

  async removeFromCart(user: User, productId: string) {
    await this.userModel.findByIdAndUpdate(user._id, {
      cart: user.cart.filter(product => product._id.toString() !== productId),
    });
    return productId;
  }

  async deleteUser(id: string) {
    return this.userModel.findByIdAndDelete(id);
  }
}
