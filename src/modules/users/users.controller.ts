import { Body, Controller, Get,Post, Headers, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { GetUser } from 'src/common/decorators/get-user-decorator';
import { registerUserDTO } from './dto/user.dto';
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {

    }

    @Get("test")
    async test(@GetUser() user) {
        
    }
    @Post("register-from-google")
    async registerUserByGoogle(@Body() user : registerUserDTO){
        const {email} = user;
        const attemptToFindUser = await this.usersService.findUserByEmail(email);
        if(!attemptToFindUser){
            let newUser = await this.usersService.createFromGoogle(user);
        }
    }
}
