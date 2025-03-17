import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { SubscribeService } from './subscribe.service';
import { SubscribeEmailDto } from './dto/subscribeEmail.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { JwtGuard } from 'src/auth/guards/jwt-auth.guard';
import { JwtStrategy } from 'src/auth/jwt.strategy';

@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Post()
  async subscribe(@Body() subscribeEmailDto: SubscribeEmailDto) {
    return this.subscribeService.addSubscriber(subscribeEmailDto.email);
  }

  @Get()
  @UseGuards(new JwtGuard(JwtStrategy), AdminGuard)
  async getSubscribers() {
    return this.subscribeService.getAllSubscribers();
  }
}
