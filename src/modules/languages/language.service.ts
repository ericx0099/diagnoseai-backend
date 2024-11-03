import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Language, LanguageDocument } from './schema/language.schema';
import { Model } from 'mongoose';
import { LanguageModule } from './language.module';

@Injectable()
export class LanguageService {
  constructor(
    @InjectModel(Language.name) private languageModule: Model<LanguageDocument>,
  ) {}

  async insertMany(array) {
    await this.languageModule.insertMany(array);
  }
  async find(params: any): Promise<Language[] | null> {
    try {
      const all = await this.languageModule.find(params).exec();
      return all;
    } catch (err) {
      Logger.debug(err);
      return null;
    }
  }
  async findOne(params: any): Promise<Language | null> {
    try {
      const language = await this.languageModule.findOne(params );
      return language;
    } catch (err) {
      Logger.debug(err);
      return null;
    }
  }
}
