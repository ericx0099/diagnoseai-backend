import { Body, Controller, Get, Param, Post, Request } from '@nestjs/common';
import { DiagnosisService } from './diagnosis.service';
import { createDiagnosisDTO } from './dto/diagnosis.dto';
import RequestWithUser from 'src/types/request/RequestWithUser';
import { ResponseService } from 'src/shared/response/response.service';
import { Diagnosis, DiagnosisToFrontend } from './schema/diagnosis.schema';
import { FlowiseService } from '../flowise/flowise.service';
@Controller('diagnosis')
export class DiagnosisController {
  constructor(
    private diagnosisService: DiagnosisService,
    private responseService: ResponseService,
    private flowiseService: FlowiseService,
  ) {}
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
      const updatedDiagnosis = await this.diagnosisService.addQuestionsToDiagnosis(created, listOfQuestions);
      response.success = true;
      response.message = 'diagnosis:created';     
      response.data = updatedDiagnosis.toFrontEnd();
    }
    return response;
  }

  @Get(":uuid")
  async getDiagnosisByUuid(@Param("uuid") uuid: string, @Request() req: RequestWithUser){
    const diagnosis = await this.diagnosisService.getDiagnosisByUuid(uuid);
    const response = this.responseService.createResponse<DiagnosisToFrontend>();
    response.message = "diagnosis:not_found";
    if(diagnosis.user_id != req.user.id ){
        return response;
    }
    response.data = diagnosis.toFrontEnd();
    response.success = true,
    response.message = "diagnosis:fetched";
    return response;
  }
}
