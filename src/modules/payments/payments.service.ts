import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import { Model ,} from 'mongoose';
import {
  Subscription,
  SubscriptionDocument,
} from './schema/suscription.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModule: Model<PaymentDocument>,
    @InjectModel(Subscription.name)
    private subscriptionModule: Model<SubscriptionDocument>,
  ) {}

  public extractPaymentIdFromInvoice(invoice: any) {
    let priceId = null;
    console.log(invoice.lines);
    if (invoice.lines && invoice.lines.data.length > 0) {
      invoice.lines.data.forEach((line) => {
        priceId = line.price?.id;
      });
    }

    return priceId;
  }

  async storePayment(object) {
    
    let payment = null;
    try {
        payment = await this.paymentModule.create(object);
    } catch (err) {
      Logger.debug('ERROR CREATING PAYMENT', err);
      return null;
    }

    return payment;
  }
  async storeSubscription(object) {
    
    let subscription = null;
    try {
        subscription = await this.subscriptionModule.create(object);
    } catch (err) {
      Logger.debug('ERROR CREATING SUBSCRIPTION', err);
      return null;
    }

    return subscription;
  }
}
