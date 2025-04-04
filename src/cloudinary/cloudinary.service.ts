import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { ConfigService } from '@nestjs/config';
import { UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('CLOUD_NAME'),
      api_key: this.configService.get('API_KEY'),
      api_secret: this.configService.get('API_SECRET'),
    });
  }

  async uploadSmallImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'Bruden', transformation: { width: 260, height: 260, crop: 'fill' } },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async uploadLargeImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'Bruden', transformation: { width: 430, height: 560, crop: 'fill' } },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }

  async uploadTagImg(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          { folder: 'Bruden', transformation: { width: 360, height: 290, crop: 'fill' } },
          (err, result) => {
            if (err) return reject(err);
            resolve(result);
          },
        )
        .end(file.buffer);
    });
  }
}
