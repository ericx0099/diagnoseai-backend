import { Module } from '@nestjs/common';
import { Diagnosis, DiagnosisSchema } from './schema/diagnosis.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { DiagnosisController } from './diagnosis.controller';
import { DiagnosisService } from './diagnosis.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Diagnosis.name, schema: DiagnosisSchema },
    ]),
  ],
  controllers: [DiagnosisController],
  providers: [DiagnosisService],
})
export class DiagnosisModule {}
