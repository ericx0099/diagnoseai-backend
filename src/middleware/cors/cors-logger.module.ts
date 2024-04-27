// src/auth/auth.module.ts
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { CorsLoggerMiddleware } from './cors-logger-middleware';
@Module({
  providers: [],
  exports: []
})
export class CorsLoggerModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CorsLoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });  
  }
}
