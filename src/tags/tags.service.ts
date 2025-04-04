import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Tag } from './tags.schema';
import { CreateTagDto } from './dto/createTag.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private tagModel: Model<Tag>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async getTags() {
    return this.tagModel.find();
  }

  async getTagByName(name: string) {
    return this.tagModel.findOne({ name }).exec();
  }

  async createTag(tagDto: CreateTagDto, img: Express.Multer.File) {
    const imgUpload = await this.cloudinaryService.uploadTagImg(img);

    const newProduct = new this.tagModel({
      ...tagDto,
      img: imgUpload.secure_url,
      imgId: imgUpload.public_id,
    });

    return newProduct.save();
  }
}
