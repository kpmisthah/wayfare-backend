import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
// import * as cookieParser from 'cookie-parser'
import { Logging } from './infrastructure/core/custom-logger';
import helmet from 'helmet';
import { UnauthorizedExceptionFilter } from './infrastructure/filters/unauthorized.filter';
import { json, urlencoded } from 'express';
const cookieParser = require('cookie-parser');

async function bootstrap() {
  const customLoggerService = new Logging();
  try {
    // const app = await NestFactory.create(AppModule, {
    //   logger: WinstonModule.createLogger(
    //     customLoggerService.createLoggerConfig,
    //   ),
    // });

    const app = await NestFactory.create(AppModule);
    // app.useGlobalFilters(new GlobalExceptionFilter());
    app.use(
      json({
        verify: (req: any, res, buf) => {
          if (req.originalUrl.includes('/webhook')) {
            req.rawBody = buf.toString();
          }
        },
      }),
    );

    app.use(
      urlencoded({
        extended: true,
        verify: (req: any, res, buf) => {
          if (req.originalUrl.includes('/webhook')) {
            req.rawBody = buf.toString();
          }
        },
      }),
    );

    // const graph = generateAppGraph(app);
    // console.log(graph);
    // fs.writeFileSync('app.module.mmd', graph);
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
