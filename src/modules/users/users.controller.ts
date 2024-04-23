import { Controller, Get, Headers, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { GetUser } from 'src/common/decorators/get-user-decorator';
@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {

    }

    @Get("test")
    async test(@GetUser() user) {
        
    }
}
