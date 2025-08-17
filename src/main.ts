import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { Logging } from './infrastructure/core/custom-logger';
import { WinstonModule } from 'nest-winston';
import helmet from 'helmet';
import { UnauthorizedExceptionFilter } from './infrastructure/filters/unauthorized.filter';

async function bootstrap() {
  const customLoggerService = new Logging();
  try {
    // const app = await NestFactory.create(AppModule, {
    //   logger: WinstonModule.createLogger(
    //     customLoggerService.createLoggerConfig,
    //   ),
    // });

    const app = await NestFactory.create(AppModule)

    app.useGlobalFilters(new UnauthorizedExceptionFilter());
    app.use(helmet());
    // Enable cookie parser
    app.use(cookieParser());

    // CORS Setup
    app.enableCors({
      origin: ['http://localhost:3000', 'http://frontend:3000'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      // allowedHeaders: ['Content-Type', 'Authorization'],
    });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3005);
    console.log('Server started at http://localhost:3005');
  } catch (error) {
    console.error(error);
  }
}

bootstrap();
