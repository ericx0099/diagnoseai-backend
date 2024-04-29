import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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

}

export const UsersSchema = SchemaFactory.createForClass(User);
