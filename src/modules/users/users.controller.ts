import {
  Body,
  Controller,
  Get,
  Post,
  Headers,
  Req,
  Res,
  Request,
} from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { GetUser } from 'src/common/decorators/get-user-decorator';
import { emailDTO, registerUserDTO } from './dto/user.dto';
import { LanguageService } from '../languages/language.service';
import RequestWithUser from 'src/types/request/RequestWithUser';
import mongoose from 'mongoose';
import { ResponseService } from 'src/shared/response/response.service';
import { PaymentsService } from '../payments/payments.service';
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private languageService: LanguageService,
    private responseService: ResponseService,
    private paymentsService: PaymentsService
    
  ) {}

  @Get('test')
  async test(@GetUser() user) {}
  @Post('register-from-google')
  async registerUserByGoogle(@Body() user: registerUserDTO) {
    const { email } = user;
    const attemptToFindUser = await this.usersService.findUserByEmail(email);
    if (!attemptToFindUser) {
      await this.usersService.createFromGoogle(user);
    }
  }

  @Post('update-configuration')
  async updateConfiguration(
    @Body() body: any,
    @Request() req: RequestWithUser,
  ) {
    const { language: languageCode } = body;
    const language = await this.languageService.findOne({ code: languageCode });
    const { user } = req;
    const response = this.responseService.createResponse<boolean>();
    user.language = language._id;

    await this.usersService.updateUserLanguage(user._id, language._id);
    response.data = true;
    response.success = true;
    response.message = 'users:config_updated';
    return response;
    //   await user.replaceOne({_id:user.id}, {...user})
  }
  @Post('get-user-language')
  async getUserLanguage(@Body() body: emailDTO) {
    const { email } = body;
    const response = this.responseService.createResponse<string>();

    const attemptToFindUser = await this.usersService.findUserByEmail(email);
    if (attemptToFindUser) {
      const userPopulated = await attemptToFindUser.populate('language');
      response.data = userPopulated.language.code;
      response.success = true;
    }

    return response;
  }

  @Get('me')
  async getMyInfo(@Request() req: RequestWithUser) {
    //return true;
    const { user } = req;
    const response = this.responseService.createResponse<any>();
    const currentDate = new Date();

    // Construimos el filtro
    const query = {
      userId: user._id,
      periodStart: { $lte: currentDate }, // La fecha de inicio debe ser menor o igual a la actual
      periodEnd: { $gte: currentDate },   // La fecha de fin debe ser mayor o igual a la actual
    };
    const userActiveSuscription = await this.paymentsService.getUserActiveSuscription(query); 
    response.data = {
      diagnoses: user.diagnoses,
      aiTokens: user.aiTokens,
     language: user.language,
     subscription: userActiveSuscription
    };
    response.success = true;
    response.message = 'users:me_fetched';
    return response;
  }
}
