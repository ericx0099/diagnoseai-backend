import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import rawBodyMiddleware from './middleware/rawBody/raw-body.middleware';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.use(cookieParser());
  //app.use('/payments/success', bodyParser.raw({ type: 'application/json' }));
  
  app.use(rawBodyMiddleware());
  await app.listen(3001);
}
bootstrap();
