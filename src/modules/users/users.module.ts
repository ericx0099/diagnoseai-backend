import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersSchema } from './schema/users.schema';
import { Language, LanguageSchema } from '../languages/schema/language.schema';
import { LanguageService } from '../languages/language.service';
import { HasAuthMiddleware } from 'src/middleware/auth/has-auth.middleware';
import { AuthService } from 'src/middleware/auth/auth.service';
import { ResponseService } from 'src/shared/response/response.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UsersSchema,
      },
    ]),
    MongooseModule.forFeature([
      { name: Language.name, schema: LanguageSchema },
    ]),
  ],

  controllers: [UsersController],
  providers: [UsersService, LanguageService,AuthService, ResponseService],
})
export class UsersModule {  configure(consumer: MiddlewareConsumer) {
  consumer
    .apply(HasAuthMiddleware)
    .forRoutes({ path: 'users/update-configuration', method: RequestMethod.POST });
}}
