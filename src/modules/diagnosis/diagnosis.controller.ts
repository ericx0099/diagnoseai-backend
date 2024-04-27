import { Body, Controller, Get, Post } from "@nestjs/common";
import { DiagnosisService } from "./diagnosis.service";
import { createDiagnosisDTO } from "./dto/diagnosis.dto";
import { GetUser } from "src/common/decorators/get-user-decorator";
import { Logger } from '@nestjs/common';
@Controller("diagnosis")
export class DiagnosisController {
    constructor(private diagnosisService: DiagnosisService){

    }
    @Post()
    async create(@Body() diagnosisBody: createDiagnosisDTO) {
        const {symptoms} = diagnosisBody;
        const created = await this.diagnosisService.create(symptoms);   

    
    }

   
}