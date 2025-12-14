import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { HttpFilter } from './fitlers/http.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser(configService.get('COOKIE_SECRET')));
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpFilter());
  app.useGlobalPipes(new ValidationPipe());

  const port = configService.get<number>('PORT') ?? 3000;
  await app.listen(port, () => {
    Logger.log(`Server is running on port ${port}`);
  });
}

void bootstrap();
