import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schema/payment.schema';
import { Model } from 'mongoose';
import {
  Subscription,
  SubscriptionDocument,
} from './schema/suscription.schema';
import { User } from '../users/schema/users.schema';
import { UsersService } from '../users/users.service';

@Injectable()
export class PaymentsService {
  public prices = [
    {
      priceId: 'price_1QHUhLDeIPgDAIz9Kb2asLgG',
      diagnoses: 5,
      aiTokens: 20,
    },
    {
      priceId: 'price_1QHUTMDeIPgDAIz9aZIRaABD',
      diagnoses: 20,
      aiTokens: 50,
    },
    {
      priceId: 'price_1QHUl2DeIPgDAIz9TQgsxvl0',
      diagnoses: 50,
      aiTokens: 150,
    },
    {
      priceId: 'price_1QHUnbDeIPgDAIz9KV5AwRqE',
      diagnoses: 200,
      aiTokens: 500,
    },
  ];
  constructor(
    @InjectModel(Payment.name)
    private paymentModule: Model<PaymentDocument>,
    @InjectModel(Subscription.name)
    private subscriptionModule: Model<SubscriptionDocument>,
    private readonly usersService: UsersService
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

  async giveAccess(priceId: string, user: User) {
    const price = this.prices.find((p) => p.priceId == priceId);
    if (!price) {
      return false;
    }
    const diagnoses = (user.diagnoses ? user.diagnoses : 0) + price.diagnoses;
    const aiTokens = (user.aiTokens ?user.aiTokens : 0)+ price.aiTokens
    const toUpdate = {diagnoses, aiTokens};

    await this.usersService.updateUser(user._id, toUpdate);
  }

  async getUserPayments(user: User) :  Promise<Payment[]>{
    const payments = await this.paymentModule.find({userId: user._id}).sort({'createdAt':-1}).exec();
    return payments;
  }
  async filterSubscriptions(filters: Record<string, any>) {
    try {
      // Usamos el método find() de Mongoose, que permite pasar un objeto de filtros
      const subscriptions = await this.subscriptionModule.find(filters).exec();

      return subscriptions;
    } catch (error) {
      throw new Error('Error al filtrar las suscripciones: ' + error.message);
    }
  }
  async getUserActiveSuscription(filters: Record<string, any>){
    try {
      // Usamos el método find() de Mongoose, que permite pasar un objeto de filtros
      const subscription = await this.subscriptionModule.findOne(filters).exec();

      return subscription;
    } catch (error) {
      throw new Error('Error al filtrar las suscripciones: ' + error.message);
    }
  }
}
