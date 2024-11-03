import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Diagnosis,
  DiagnosisDocument,
  DiagnosisQuestions,
} from './schema/diagnosis.schema';
import { Model } from 'mongoose';
import { v4 } from 'uuid';
import { DiagnosisModule } from './diagnosis.module';
import { User } from '../users/schema/users.schema';
@Injectable()
export class DiagnosisService {
  constructor(
    @InjectModel(Diagnosis.name)
    private diagnosisModule: Model<DiagnosisDocument>,
  ) {}

  async create(symptoms: string, user: User): Promise<Diagnosis | null> {
    const toCreate = {
      symptoms,
      uuid: v4(),
      user_id: user._id,
    };

    let diagnosis = null;
    try {
      diagnosis = await this.diagnosisModule.create(toCreate);
    } catch (err) {
      Logger.debug('ERROR CREATING DIAGNOSIS', err);
      return null;
    }

    return diagnosis;
  }

  async addQuestionsToDiagnosis(
    diagnosis: Diagnosis,
    questions: string[],
  ): Promise<Diagnosis> {
    const updatedQuestions: DiagnosisQuestions[] = [];
    for (const q of questions) {
      if (q.trim().length > 0) {
        const newQuestion: DiagnosisQuestions = {
          uuid: v4(),
          question: q,
          answer: null,
        };
        updatedQuestions.push(newQuestion);
      }
    }

    const currentQuestions = [...diagnosis.questions, ...updatedQuestions];
    const updatedDiagnosis = await this.diagnosisModule.findByIdAndUpdate(
      diagnosis.id,
      { questions: currentQuestions },
      { new: true },
    );

    return updatedDiagnosis as unknown as Diagnosis;
  }

  async getDiagnosisByUuid(uuid: string): Promise<Diagnosis> {
    let diagnosis = null;

    try {
      diagnosis = await this.diagnosisModule.findOne({ uuid });
    } catch (err) {
      Logger.debug('Error getting diagnose by UUID. UUID:' + uuid);
    }
    return diagnosis;
  }

  async updateOne(uuid: string, toUpdate: any) {
    const result = await this.diagnosisModule.updateOne(
      { uuid },
      { ...toUpdate },
    );
    return result;
  }

  async fetchDiagnoses(user: User): Promise<Diagnosis[]> {
    let diagnoses = undefined;
    try {
      diagnoses = await this.diagnosisModule
        .find({ user_id: user._id })
        .sort({ createdAt: -1 })
        .exec();
    } catch (err) {
      Logger.debug(
        'Error getting diagnose by user (fn fetchDiagnoses):' + user,
      );
    }

    return diagnoses;
  }
  
}
