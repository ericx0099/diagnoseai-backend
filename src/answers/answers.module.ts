import { Module } from "@nestjs/common";
import { AnswerController } from "./answers.controller";

@Module({
    imports: [],
    controllers: [AnswerController],
    providers: []
})
export class AnswersModule {
    
}