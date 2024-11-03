import { Controller, Get } from "@nestjs/common";
import { LanguageService } from "./language.service";
import { Language } from "./schema/language.schema";
import { v4 } from "uuid";
import { ResponseService } from "src/shared/response/response.service";


@Controller("languages")
export class LanguageController {
    constructor (
        private languageService: LanguageService,
        private responseService: ResponseService
    ){}
    @Get("/")
    async findAll(){
        const response = this.responseService.createResponse<Language[]>();

        const languages = await this.languageService.find({});
        response.data = languages;
        response.success = true;
        response.message = "global:fetched";
        return response;
    }

    @Get("/seed")
    async seed(){
        const languages = [
            {
                uuid: v4(),
                code: 'es',
                english_name: "Spanish"
            },
            {
                uuid: v4(),
                code: 'en',
                english_name: "English"
            },
        ];
        await this.languageService.insertMany(languages)
    }
}