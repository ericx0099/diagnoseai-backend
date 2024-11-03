import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Language, LanguageSchema } from "./schema/language.schema";
import { LanguageService } from "./language.service";
import { LanguageController } from "./language.controller";
import { ResponseService } from "src/shared/response/response.service";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Language.name, schema: LanguageSchema}
        ])
    ],
    controllers: [LanguageController],
    providers: [LanguageService, ResponseService]
})
export class LanguageModule {

}