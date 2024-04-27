import { Module } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './middleware/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DiagnosisModule } from './modules/diagnosis/diagnosis.module';
import { CorsLoggerModule } from './middleware/cors/cors-logger.module';
@Module({
  imports: [
    TasksModule,
    UsersModule,
    AuthModule,
    DiagnosisModule,
    CorsLoggerModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_URI),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
