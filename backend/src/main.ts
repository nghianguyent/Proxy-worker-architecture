import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from './fitlers/http-exception.filter';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeORMExceptionFilter } from './fitlers/typeorm-exception.filter';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser(configService.get('COOKIE_SECRET')));
  app.setGlobalPrefix('api', {
    exclude: ['/_ah/warmup'],
  });
  app.useGlobalFilters(new HttpExceptionFilter(), new TypeORMExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const trustProxy: string[] = JSON.parse(process.env.TRUST_PROXY ?? '[]');

  app.set('trust proxy', trustProxy);

  const port = configService.get<number>('PORT') ?? 3000;

  await app.listen(port, () => {
    Logger.log(`Server is running on port ${port}`);
  });
}

void bootstrap();
