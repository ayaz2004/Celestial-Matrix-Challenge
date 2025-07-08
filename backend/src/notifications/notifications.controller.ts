import {
  Controller,
  Get,
  Put,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';
import { User } from '../entities/user.entity';
import { GetUser } from '../decorators/get-user.decorator';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
  constructor(private notificationsService: NotificationsService) {}

  @Get()
  async getUserNotifications(
    @GetUser() user: User,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.notificationsService.getUserNotifications(
      user,
      Number(page),
      Number(limit),
    );
  }

  @Get('unread-count')
  async getUnreadCount(@GetUser() user: User) {
    return { count: await this.notificationsService.getUnreadCount(user) };
  }

  @Put(':id/read')
  async markAsRead(@Param('id') id: string, @GetUser() user: User) {
    return this.notificationsService.markAsRead(id, user);
  }

  @Put('read-all')
  async markAllAsRead(@GetUser() user: User) {
    await this.notificationsService.markAllAsRead(user);
    return { message: 'All notifications marked as read' };
  }
}
