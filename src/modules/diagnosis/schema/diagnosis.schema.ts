import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IsOptional } from 'class-validator';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/modules/users/schema/users.schema';
import { plainToClass } from 'class-transformer';

export type DiagnosisDocument = Diagnosis & Document;
@Schema({ timestamps: true })
export class Diagnosis extends Document {
  @Prop()
  uuid: string;

  @Prop()
  symptoms: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user_id: User;

  @Prop()
  questions: DiagnosisQuestions[];


  toFrontEnd: Function;
}
export const DiagnosisSchema = SchemaFactory.createForClass(Diagnosis);

DiagnosisSchema.methods.toFrontEnd = function() : DiagnosisToFrontend {
  const { uuid, symptoms, questions } = this.toObject();
  return { uuid, symptoms, questions };
}

export class DiagnosisQuestions {
  @Prop()
  uuid: string;

  @Prop()
  question: string;

  @Prop()
  answer: string | null;
}


export interface DiagnosisToFrontend {
  uuid:string;
  symptoms: string;
  questions: DiagnosisQuestions[]
}


