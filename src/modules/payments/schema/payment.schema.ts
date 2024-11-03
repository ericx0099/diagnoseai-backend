import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
  @Prop({ required: true })
  stripeInvoiceId: string;

  @Prop({ required: true })
  stripeCustomerId: string;

  @Prop({ required: true })
  stripeSubscriptionId: string;

  @Prop({ required: true })
  customer_email: string;

  @Prop({ required: true })
  priceId: string;

  @Prop({ required: true })
  status: string;

  @Prop({ required: true })
  amount_paid: number;

  @Prop({ required: true })
  currency: string;

  @Prop()
  tax?: number;

  @Prop()
  payment_intent_id: string;

  @Prop({ type: Map, of: String })
  metadata?: Map<string, string>; // Opcional para almacenar metadatos adicionales

  @Prop()
  description?: string; // Opcional, si se proporciona una descripción

  @Prop()
  invoice_pdf_url?: string; // URL del PDF de la factura

  @Prop({ type: String, default: null })
  userId?: string; // ID del usuario (puede ser nulo)
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
export type PaymentDocument = Payment & Document;