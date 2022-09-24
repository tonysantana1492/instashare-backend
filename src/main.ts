import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');
  const app = await NestFactory.create(AppModule);  
  if (process.env.NODE_ENV === 'production') {
    app.enableCors({
      origin: 'https://nest-instashare-backend.herokuapp.com',
      credentials: true,
    });
  } else{
    app.enableCors();
  }
  const port = process.env.PORT || 4000;
  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}
bootstrap();
