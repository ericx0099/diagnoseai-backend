import {
  Body,
  Controller,
  Post,
  Logger,
  Request,
  Headers,
  Get,
} from '@nestjs/common';
import { sign } from 'crypto';
import Stripe from 'stripe';
import { StripeService } from '../stripe/stripe.service';
import { PaymentsService } from './payments.service';
import { UsersService } from '../users/users.service';
import RequestWithUser from 'src/types/request/RequestWithUser';
import { ResponseService } from 'src/shared/response/response.service';
import { Payment } from './schema/payment.schema';

@Controller('payments')
export class PaymentsController {
  private readonly logger = new Logger(PaymentsController.name);

  constructor(
    private stripeService: StripeService,
    private paymentsService: PaymentsService,
    private usersService: UsersService,
    private responseService: ResponseService,
  ) {}

  @Post('/succeed')
  async paymentSucceed(
    @Body() body: any,
    @Request() req: Request,
    @Headers('stripe-signature') stripeSignature: string,
  ) {
    // Usa @Body() para obtener el cuerpo de la solicitud
    //this.logger.log('Recibiendo el cuerpo de la solicitud:', body);

    // Procesa la lógica aquí
    let event;
    const rawBody = req['rawBody'];
    try {
      event = await this.stripeService.constructEventFromPayload(
        stripeSignature,
        rawBody,
      );
    } catch (error) {
      this.logger.error('Error al recuperar el PaymentIntent:', error);
      return { success: false, error: error.message };
    }
    const data = event.data;
    const eventType = event.type;
    if (eventType == 'invoice.payment_succeeded') {
      const { object: invoice } = data;
      //const session = await this.stripeService.retrieveSession(object.id);
      const priceId = this.paymentsService.extractPaymentIdFromInvoice(invoice);
      const user = await this.usersService.findUserByEmail(
        invoice.customer_email,
      );
      if (!user) {
        //CREATE USER ?
        return false;
      }

      await this.usersService.storeStripeCustomerId(invoice.customer_email, invoice.customer);

      const paymentData = {
        stripeInvoiceId: invoice.id,
        stripeCustomerId: invoice.customer,
        stripeSubscriptionId: invoice.subscription,
        customer_email: invoice.customer_email,
        priceId,
        status: invoice.status,
        amount_paid: invoice.amount_paid,
        currency: invoice.currency,
        tax: invoice.tax,
        payment_intent_id: invoice.payment_intent,
        metadata: invoice.metadata,
        description: invoice.description,
        invoice_pdf_url: invoice.invoice_pdf,
        userId: user._id,
      };
      await this.paymentsService.storePayment(paymentData);
      const subscription = await this.stripeService.getSuscriptionById(
        invoice.subscription,
      );
      if (subscription) {
        const currentPeriodStart = new Date(
          subscription.current_period_start * 1000,
        );
        const currentPeriodEnd = new Date(
          subscription.current_period_end * 1000,
        );
        const subscriptionData = {
          stripeSubscriptionId: invoice.subscription,
          periodStart: currentPeriodStart,
          periodEnd: currentPeriodEnd,
          stripeCustomerId: invoice.customer,
          userId: user._id,
          status: subscription.status,
        };
        await this.paymentsService.storeSubscription(subscriptionData);
        await this.paymentsService.giveAccess(priceId, user);

      }
    }
  }

  @Post("/create-checkout-session")
  async createCheckoutSession(@Body() body: any){
    const { email, priceId } = body;
    const session = await this.stripeService.createCheckoutSession(email, priceId);
    const response = this.responseService.createResponse<string>();
    if(session.url){
        response.data = session.url;
        response.success = true;
        response.message = "plans:url_generated";
    }
    return response;
  }
  @Get("/portal-link")
  async generateCustomerPortalSession(@Request() req: RequestWithUser){
    const response = this.responseService.createResponse<string>();
    response.message = 'plan:portal_link_not_generated';
    const {user} = req;
    if(user.stripeCustomerId){
      const link = await this.stripeService.createCustomerPortalSession(user.stripeCustomerId,`${process.env.FRONTEND_URL}/profile`);
      response.data = link;
      response.success = true;
      response.message = "";
    }
    return response;
  }

  @Get("/")
  async getMyPayments(@Request() req: RequestWithUser){
    const {user} = req;
    const payments = await this.paymentsService.getUserPayments(user);
    const response = this.responseService.createResponse<Payment[]>();
    response.data = payments;
    response.success = true;
    response.message = "payments:payments_fetched";
    return response;
  }





}
