import { IsString } from "class-validator";

export class createDiagnosisDTO {

    @IsString()
    symptoms: string;


}