import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/modules/users/schema/users.schema';
export type DiagnosisDocument = Diagnosis & Document;
@Schema({ timestamps: true })
export class Diagnosis {
  @Prop()
  uuid: string;

  @Prop()
  symptoms: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  user_id: User;
}
export const DiagnosisSchema = SchemaFactory.createForClass(Diagnosis);
