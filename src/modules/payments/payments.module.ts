import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { User, UsersSchema } from '../users/schema/users.schema';
import { PaymentsController } from './payments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { StripeService } from '../stripe/stripe.service';
import { PaymentsService } from './payments.service';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { Subscription, SubscriptionSchema } from './schema/suscription.schema';
import { UsersService } from '../users/users.service';
import { HasAuthMiddleware } from 'src/middleware/auth/has-auth.middleware';
import { ResponseService } from 'src/shared/response/response.service';
import { AuthService } from 'src/middleware/auth/auth.service';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UsersSchema }]),
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    MongooseModule.forFeature([{ name: Subscription.name, schema: SubscriptionSchema }]),
  ],
  controllers: [PaymentsController],
  providers: [StripeService, PaymentsService, UsersService, ResponseService, AuthService],
})
export class PaymentsModule {
  
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(HasAuthMiddleware)
      .forRoutes({ path: 'payments/create-checkout-session', method: RequestMethod.POST });
  }
      
}
