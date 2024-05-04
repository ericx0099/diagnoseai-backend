import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { createDiagnosisDTO } from './dto/diagnosis.dto';
import RequestWithUser from 'src/types/request/RequestWithUser';
import { ResponseService } from 'src/shared/response/response.service';
import {
  Diagnosis,
  DiagnosisQuestions,
  DiagnosisToFrontend,
} from './schema/diagnosis.schema';
import { FlowiseService } from '../flowise/flowise.service';
import { storeAnswerDto } from './dto/store-answer.dto';
@Controller('diagnosis')
export class DiagnosisController {
  constructor(
    private diagnosisService: DiagnosisService,
    private responseService: ResponseService,
    private flowiseService: FlowiseService,
  ) {}

  @Get()
  async getAllMyDiagnoses(@Request() req: RequestWithUser) {
    const { user } = req;
    const response =
      this.responseService.createResponse<DiagnosisToFrontend[]>();
    const diagnosisResponse = await this.diagnosisService.fetchDiagnoses(user);

    const diagnoses: DiagnosisToFrontend[] = diagnosisResponse.map((d) => {
      return d.toFrontEnd();
    });
    response.success = true;
    response.message = 'diagnoses:fetched';
    if (diagnoses) {
      response.data = diagnoses;
    }
    return response;
  }

  @Post()
  async create(
    @Body() diagnosisBody: createDiagnosisDTO,
    @Request() req: RequestWithUser,
  ) {
    const { symptoms } = diagnosisBody;
    const { user } = req;
    const response = this.responseService.createResponse<DiagnosisToFrontend>();
    const created = await this.diagnosisService.create(symptoms, user);
    response.message = 'diagnosis:not_created';
    if (created) {
      //TODO::THIS USER CAN PERFORM THIS ACTION BY TOKENS?
      let listOfQuestions = await this.flowiseService.getQuestions(symptoms);
      const updatedDiagnosis =
        await this.diagnosisService.addQuestionsToDiagnosis(
          created,
          listOfQuestions,
        );
      response.success = true;
      response.message = 'diagnosis:created';
      response.data = updatedDiagnosis.toFrontEnd();
    }
    return response;
  }

  @Get(':uuid')
  async getDiagnosisByUuid(
    @Param('uuid') uuid: string,
    @Request() req: RequestWithUser,
  ) {
    const diagnosis = await this.diagnosisService.getDiagnosisByUuid(uuid);
    const response = this.responseService.createResponse<DiagnosisToFrontend>();
    response.message = 'diagnosis:not_found';
    if (diagnosis.user_id != req.user.id) {
      return response;
    }
    response.data = diagnosis.toFrontEnd();
    (response.success = true), (response.message = 'diagnosis:fetched');
    return response;
  }

  @Post(`/update-answer`)
  async storeAnswer(
    @Request() req: RequestWithUser,
    @Body() body: storeAnswerDto,
  ) {
    const { answer, answer_uuid, diagnosis_uuid } = body;
    const { user } = req;
    const response = this.responseService.createResponse<boolean>();
    response.message = 'diagnosis:not_found';
    const diagnosis =
      await this.diagnosisService.getDiagnosisByUuid(diagnosis_uuid);

    if (!diagnosis || !diagnosis.user_id == user.id) {
      return response;
    }
    const updatedQuestions = diagnosis.questions.map(
      (question: DiagnosisQuestions) => {
        if (question.uuid === answer_uuid) {
          question.answer = answer;
        }
        return question;
      },
    );
    // Guarda los cambios
    await this.diagnosisService.updateOne(diagnosis_uuid, {
      questions: updatedQuestions,
    });
    response.data = diagnosis.toFrontEnd();
    response.success = true;
    response.message = 'diagnosis:answer_updated';
    return response;
  }

  @Post(':uuid/generate-diagnosis')
  async generateDiagnosis(
    @Param('uuid') uuid: string,
    @Request() req: RequestWithUser,
  ) {
    const { user } = req;
    const response = this.responseService.createResponse<boolean>();
    response.message = 'diagnosis:not_found';
    const diagnosis =
      await this.diagnosisService.getDiagnosisByUuid(uuid);

    if (!diagnosis || !diagnosis.user_id == user.id) {
      return response;
    }
       //TODO::THIS DIAGNOSIS HAS BEEN ALREADY EXECUTEd?
       //TODO::THIS USER HAS TOKENS TO PERFORM THIS ACTION??
    const diagnosisResults = await this.flowiseService.generateDiagnose(diagnosis);
    await this.diagnosisService.updateOne(diagnosis.uuid, diagnosisResults);

  }
}
