import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Language } from 'src/modules/languages/schema/language.schema';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User extends Document{
  @Prop()
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  image: string;

  @Prop()
  google_id: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Language.name })
  language: Language;

}

export const UsersSchema = SchemaFactory.createForClass(User);
