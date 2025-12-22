import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { UnauthorizedExceptionFilter } from './infrastructure/filters/unauthorized.filter';
import { json, urlencoded, Request, Response } from 'express';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.use(
      json({
        verify: (
          req: Request & { rawBody?: string },
          res: Response,
          buf: Buffer,
        ) => {
          if (req.originalUrl.includes('/webhook')) {
            req.rawBody = buf.toString();
          }
        },
      }),
    );

    app.use(
      urlencoded({
        extended: true,
        verify: (
          req: Request & { rawBody?: string },
          res: Response,
          buf: Buffer,
        ) => {
          if (req.originalUrl.includes('/webhook')) {
            req.rawBody = buf.toString();
          }
        },
      }),
    );

    app.useGlobalFilters(new UnauthorizedExceptionFilter());
    app.use(helmet());

    app.use(cookieParser());

    app.enableCors({
      origin: ['https://wayfare.misthah.site'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000, '0.0.0.0');
  } catch (error) {
    console.error(error);
  }
}

void bootstrap();
