import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TagsService } from './tags.service';
import { TagsController } from './tags.controller';
import { TagSchema, Tag } from './tags.schema';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { FileUploadModule } from 'src/fileUpload/fileUpload.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
    CloudinaryModule,
    FileUploadModule,
  ],
  controllers: [TagsController],
  providers: [TagsService],
  exports: [TagsService],
})
export class TagsModule {}
