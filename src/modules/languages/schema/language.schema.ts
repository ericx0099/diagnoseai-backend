import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({})
export class Language extends Document {
    @Prop()
    uuid: string;

    @Prop()
    code: string;
    
    @Prop()
    english_name: string;
}
export const LanguageSchema = SchemaFactory.createForClass(Language);
export type LanguageDocument = Language & Document;