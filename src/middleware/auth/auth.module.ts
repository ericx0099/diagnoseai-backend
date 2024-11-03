// src/auth/auth.module.ts
import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthMiddleware } from './auth.middleware';
import { UsersService } from 'src/modules/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersSchema } from 'src/modules/users/schema/users.schema';
@Module({
  providers: [AuthService,UsersService],
  exports: [AuthService],
  imports:[   MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),]
})
export class AuthModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });  
  }
}
