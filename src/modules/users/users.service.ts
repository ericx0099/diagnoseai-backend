import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/users.schema';
import { UsersModule } from './users.module';
import { Model } from 'mongoose';
import { registerUserDTO } from './dto/user.dto';
@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModule: Model<UsersModule>) {}

  async findUserByEmail(email: string): Promise<UserDocument | null> {
    let user = undefined;

    try {
      user = (await this.userModule.findOne({ email })).populate('language');
    
    } catch (error) {
      console.log('error', error);
    }
    return user;
  }
  async createFromGoogle(_user: registerUserDTO) {
    let user = undefined;
    //TODO::BY DEFAULT GET EN LANGUAGE
    user.diagnoses = 3;
    user.aiTokens = 10;
    try {
      user = await this.userModule.create(_user);
    } catch (err) {}
    return user;
  }

  test() {
    return 'test';
  }
  async updateUserLanguage(userId: string, languageId: string): Promise<User> {
    return this.userModule.findByIdAndUpdate(
      userId,
      { language: languageId },
      { new: true }
    );
  }
  async updateUser(userId: string, updateData: any): Promise<User> {
    return this.userModule.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );
  }

  async storeStripeCustomerId(user_email: string, stripeCustomerId: string){
    let user = await this.findUserByEmail(user_email);
    const toUpdate = {stripeCustomerId};
    this.updateUser(user._id,toUpdate);
  }
  async getUserAvailableDiagnoses(user: User){
    return user.diagnoses;
  }
}
