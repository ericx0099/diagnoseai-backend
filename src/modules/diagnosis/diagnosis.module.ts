import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { Diagnosis, DiagnosisSchema } from './schema/diagnosis.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DiagnosisController } from './diagnosis.controller';
import { DiagnosisService } from './diagnosis.service';
import { HasAuthMiddleware } from 'src/middleware/auth/has-auth.middleware';
import { AuthService } from 'src/middleware/auth/auth.service';
import { UsersService } from '../users/users.service';
import { UsersModule } from '../users/users.module';
import { User, UsersSchema } from '../users/schema/users.schema';
import { ResponseService } from 'src/shared/response/response.service';
import { FlowiseService } from '../flowise/flowise.service';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Diagnosis.name, schema: DiagnosisSchema },
    ]),
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
  ],
  controllers: [DiagnosisController],
  providers: [DiagnosisService, AuthService, UsersService,ResponseService,FlowiseService],
})
export class DiagnosisModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HasAuthMiddleware)
      .forRoutes({ path: 'diagnosis*', method: RequestMethod.ALL });
  }
}