import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async getUserNotifications(
    user: User,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ notifications: Notification[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [notifications, total] = await this.notificationRepository.findAndCount({
      where: { user: { id: user.id } },
      relations: ['comment', 'comment.author'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      notifications,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async markAsRead(notificationId: string, user: User): Promise<Notification> {
    try {
      const notification = await this.notificationRepository.findOne({
        where: { id: notificationId, user: { id: user.id } },
      });

      console.log('Found notification:', notification);

      if (!notification) {
        throw new Error('Notification not found');
      }

      notification.isRead = true;
      const saved = await this.notificationRepository.save(notification);
      console.log('Saved notification:', saved);
      
      return saved;
    } catch (error) {
      console.error('Error in markAsRead:', error);
      throw error;
    }
  }

  async markAllAsRead(user: User): Promise<void> {
    await this.notificationRepository.update(
      { user: { id: user.id }, isRead: false },
      { isRead: true },
    );
  }

  async getUnreadCount(user: User): Promise<number> {
    return this.notificationRepository.count({
      where: { user: { id: user.id }, isRead: false },
    });
  }
}
