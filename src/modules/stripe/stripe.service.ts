
import { Injectable } from '@nestjs/common';

import Stripe from 'stripe';
 
@Injectable()
export class StripeService {
  private stripe: Stripe;
    private STRIPE_WEBHOOK_KEY : string;
  constructor(

  ) {
    this.STRIPE_WEBHOOK_KEY = process.env.STRIPE_WEBHOOK_KEY;
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  }
 
  public async constructEventFromPayload(signature: string, payload: Buffer) { 
    return this.stripe.webhooks.constructEvent(
      payload,
      signature,
      this.STRIPE_WEBHOOK_KEY
    );
  }

  public async retrieveSession(objectId){
    const session = await this.stripe.checkout.sessions.retrieve(objectId);
    return session;
  }

  public async  getSuscriptionById(subscriptionId: string) {
    try {
      const subscription = await this.stripe.subscriptions.retrieve(subscriptionId);  
      return subscription; 
    } catch (error) {
      console.error("Error al obtener la suscripción:", error);
      throw error; 
    }
  }

  async createCheckoutSession(email: string, priceId: string) {
    return await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: process.env.FRONTEND_URL+"/my-diagnoses",
      cancel_url: process.env.FRONTEND_URL+"/profile",
    });
  }
 
}