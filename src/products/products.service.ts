import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Product } from './products.schema';
import { TourDto } from './dto/tour.dto';

interface ProductFilter {
  limit: number;
  page: number;
  sortBy?: string;
  sortByDesc?: string;
  filter?: string;
  tags?: string;
}

@Injectable()
export class ProductsService {
  constructor(@InjectModel(Product.name) private productModel: Model<Product>) {}

  async getProducts({ limit, page, sortBy, sortByDesc, filter, tags }: ProductFilter) {
    const normalizedFilter = filter ? filter.split('|').map(Number) : [0, 9999];

    const normalizedTags = tags ? tags.split('|').map((tag) => (Types.ObjectId.isValid(tag) ? new Types.ObjectId(tag) : tag)) : '';

    const query: any = {
      price: { $gte: normalizedFilter[0], $lte: normalizedFilter[1] },
    };

    if (normalizedTags.length > 0) {
      query.tag = { $in: normalizedTags };
    }

    const sort: any = {};
    if (sortBy) sort[sortBy] = 1;
    if (sortByDesc) sort[sortByDesc] = -1;

    const products = await this.productModel
      .find(query)
      .populate('tag')
      .sort(sort)
      .limit(limit)
      .skip((page - 1) * limit)
      .lean();

    const total = await this.productModel.countDocuments(query);

    return {
      products,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getProductById(id: Types.ObjectId) {
    return this.productModel.findById(id).populate('tag').exec();
  }

  // async getTours(page: number, limit: number, filters: TourFilters) {
  //   const query: any = {};

  //   if (filters.price) {
  //     query.price = { $lte: filters.price }; // Find tours with price <= given value
  //   }
  //   if (filters.title) {
  //     query.title = { $regex: filters.title, $options: 'i' }; // Case-insensitive search
  //   }
  //   if (filters.location) {
  //     query.location = { $regex: filters.location, $options: 'i' };
  //   }

  //   const skip = (page - 1) * limit;

  //   const totalTours = await this.tourModel.countDocuments(query);
  //   const totalPages = Math.ceil(totalTours / limit);

  //   const tours = await this.tourModel.find(query).skip(skip).limit(limit).exec();

  //   return {
  //     tours,
  //     totalPages,
  //     totalTours,
  //   };
  // }

  // async getTourById(id: Types.ObjectId) {
  //   return this.tourModel.findById(id).exec();
  // }

  // async getTourCords() {
  //   return this.tourModel.find({}, { cords: 1, _id: 1 }).lean();
  // }

  // async create(tourBody: TourDto) {
  //   const newTour = new this.tourModel(tourBody);
  //   return newTour.save();
  // }
}
