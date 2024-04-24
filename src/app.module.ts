import { Module } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [TasksModule, UsersModule,AuthModule,ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_DB_URI)
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
