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
import { JwtOptionalStrategy } from 'src/auth/jwtOptional.strategy';
import { UsersService } from 'src/users/users.service';
import { JwtOptionalAuthGuard } from 'src/auth/guards/jwtOptional.guard';

@Controller('tags')
export class TagsController {
  constructor(
    private readonly tagService: TagsService,
  ) {}

  
}
