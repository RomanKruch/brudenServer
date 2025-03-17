import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './products.schema';
import { TourDto } from './dto/tour.dto';

interface TourFilters {
  price?: number;
  title?: string;
  location?: string;
}

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private tourModel: Model<Product>) {}

  async getTours(page: number, limit: number, filters: TourFilters) {
    const query: any = {};

    if (filters.price) {
      query.price = { $lte: filters.price }; // Find tours with price <= given value
    }
    if (filters.title) {
      query.title = { $regex: filters.title, $options: 'i' }; // Case-insensitive search
    }
    if (filters.location) {
      query.location = { $regex: filters.location, $options: 'i' };
    }

    const skip = (page - 1) * limit;

    const totalTours = await this.tourModel.countDocuments(query);
    const totalPages = Math.ceil(totalTours / limit);

    const tours = await this.tourModel.find(query).skip(skip).limit(limit).exec();

    return {
      tours,
      totalPages,
      totalTours,
    };
  }

  async getTourById(id: Types.ObjectId) {
    return this.tourModel.findById(id).exec();
  }

  async getTourCords() {
    return this.tourModel.find({}, { cords: 1, _id: 1 }).lean();
  }

  async create(tourBody: TourDto) {
    const newTour = new this.tourModel(tourBody);
    return newTour.save();
  }
}
