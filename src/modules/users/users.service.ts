import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schema/users.schema';
import { UsersModule } from './users.module';
import { Model } from 'mongoose';
import { registerUserDTO } from './dto/user.dto';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModule: Model<UsersModule>) {}

  async findUserByEmail(email: string){
    let user = undefined;
    try{
      user = await this.userModule.findOne({email});
    }catch(error){
      
    }
    return user;
  }
  async createFromGoogle(_user: registerUserDTO){
    let user = undefined;

    try{
      user = await this.userModule.create(_user);
    }catch(err){

    }
    return user;

  }
 
  test() {
    return 'test';
  }
}
