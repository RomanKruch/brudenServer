import {
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Body,
  Param,
  BadRequestException,
  NotFoundException,
  Req,
} from '@nestjs/common';
import { TagsService } from './tags.service';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/jwt.strategy';
import { UserRequest } from 'src/types/userRequest';
import { TourDto } from './dto/tour.dto';
import { Types } from 'mongoose';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { UsersService } from 'src/users/users.service';

@Controller('tags')
export class TagsController {
  constructor(private readonly tagService: TagsService) {}

  @Get()
  async getTags() {
    return await this.tagService.getTags();
  }
}
