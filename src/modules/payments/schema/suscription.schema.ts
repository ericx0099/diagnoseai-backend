import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Subscription extends Document {
  @Prop({ required: true })
  stripeSubscriptionId: string;

  @Prop({ type: Date, required: true })
  periodStart: Date;

  @Prop({ type: Date, required: true })
  periodEnd: Date;

  @Prop({ required: true })
  stripeCustomerId: string;

  @Prop({ type: String, default: null })
  userId?: string; // ID del usuario (puede ser nulo)

  @Prop({ required: true })
  status: string; // Estado de la suscripción

  @Prop({ type: Date, default: Date.now })
  createdAt: Date; // Fecha de creación
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
export type SubscriptionDocument = Subscription & Document;