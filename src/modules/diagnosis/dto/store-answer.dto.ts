import { IsString, isNotEmpty } from "class-validator";

export class storeAnswerDto {

    @IsString()
    diagnosis_uuid: string;

    @IsString()
    answer_uuid: string;

    @IsString()
    answer:string;


}