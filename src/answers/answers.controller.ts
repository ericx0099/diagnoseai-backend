
import { Controller, Get,  } from "@nestjs/common";

@Controller("diagnosis/answer")
export class AnswerController {
    constructor(){}

    @Get()
    index(){
        return "test";
    }
}