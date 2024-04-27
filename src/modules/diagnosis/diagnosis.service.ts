import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Diagnosis } from "./schema/diagnosis.schema";
import { Model } from "mongoose";
import { v4 } from 'uuid';
import { DiagnosisModule } from "./diagnosis.module";
import { User } from "../users/schema/users.schema";


@Injectable()
export class DiagnosisService {
    constructor(@InjectModel(Diagnosis.name) private diagnosisModule: Model<DiagnosisModule>){}

    async create(symptoms: string)  {
        const toCreate = {
            symptoms,
            uuid: v4(),
            user_id : '66295e1cba679a5b57b15140'
        };
        let diagnosis = await this.diagnosisModule.create(toCreate);

        return diagnosis;
    }

}