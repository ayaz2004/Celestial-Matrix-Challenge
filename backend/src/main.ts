import { NestFactory } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor, Logger } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // Retry logic for database connection
  const maxRetries = 10;
  let retries = 0;
  
  while (retries < maxRetries) {
    try {
      logger.log(`Attempting to start application (attempt ${retries + 1}/${maxRetries})`);
      
      const app = await NestFactory.create(AppModule);
      
      app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
      }));
      
      app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
      
      // Configure CORS for production
      app.enableCors({
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        credentials: true,
      });
      
      const port = process.env.PORT || 3001;
      await app.listen(port);
      logger.log(`Application is running on port ${port}`);
      logger.log(`Health check available at: /health`);
      break; // Success - exit retry loop
      
    } catch (error) {
      retries++;
      logger.error(`Failed to start application (attempt ${retries}/${maxRetries}):`, error.message);
      
      if (retries >= maxRetries) {
        logger.error('Max retries reached, exiting...');
        process.exit(1);
      }
      
      logger.log(`Retrying in 5 seconds...`);
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
  
  // Graceful shutdown handling
  process.on('SIGTERM', () => {
    logger.log('SIGTERM received, shutting down gracefully');
    process.exit(0);
  });
}

bootstrap().catch((error) => {
  console.error('Fatal error during bootstrap:', error);
  process.exit(1);
});
