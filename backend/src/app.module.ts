import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { CommentsModule } from './comments/comments.module';
import { NotificationsModule } from './notifications/notifications.module';
import { HealthController } from './health/health.controller';
import { User } from './entities/user.entity';
import { Comment } from './entities/comment.entity';
import { Notification } from './entities/notification.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get<string>('DATABASE_URL');
        
        if (databaseUrl) {
          // Production: Use DATABASE_URL from Render
          return {
            type: 'postgres',
            url: databaseUrl,
            entities: [User, Comment, Notification],
            synchronize: true, // Change this to true
            logging: configService.get<string>('NODE_ENV') === 'development',
            ssl: configService.get<string>('NODE_ENV') === 'production' ? { rejectUnauthorized: false } : false,
            autoLoadEntities: true, // Add this for better entity loading
          };
        } else {
          // Development: Use individual DB variables
          return {
            type: 'postgres',
            host: configService.get<string>('DB_HOST'),
            port: configService.get<number>('DB_PORT'),
            username: configService.get<string>('DB_USERNAME'),
            password: configService.get<string>('DB_PASSWORD'),
            database: configService.get<string>('DB_NAME'),
            entities: [User, Comment, Notification],
            synchronize: true, // Change this to true as well
            logging: configService.get<string>('NODE_ENV') === 'development',
            autoLoadEntities: true, // Add this for better entity loading
          };
        }
      },
      inject: [ConfigService],
    }),
    AuthModule,
    CommentsModule,
    NotificationsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
