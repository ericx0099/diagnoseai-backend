import { Module } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
@Module({
  imports: [TasksModule, UsersModule,AuthModule,ConfigModule.forRoot()],
  controllers: [],
  providers: [],
})
export class AppModule {}
