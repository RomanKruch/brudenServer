import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  BadRequestException,
  UseInterceptors,
  ConflictException,
  UploadedFiles,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { CreateTagDto } from './dto/createTag.dto';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Get()
  async getTags() {
    return await this.tagService.getTags();
  }

  @Post()
  @UseGuards(new JwtGuard(JwtStrategy), AdminGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'img', maxCount: 1 }]))
  async createProduct(
    @UploadedFiles() files: { img?: Express.Multer.File[] },
    @Body() createTagDto: CreateTagDto,
  ) {
    const isExist = await this.tagService.getTagByName(createTagDto.name);

    if (isExist) {
      throw new ConflictException('Tag with same name already exist!');
    }

    const { img } = files;

    if (!img) {
      throw new BadRequestException('Img are required!');
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedMimeTypes.includes(img[0].mimetype)) {
      throw new BadRequestException('Images must be a jpeg, png or webp format!');
    }

    const newTag = await this.tagService.createTag(createTagDto, img[0]);

    return newTag;
  }
}
