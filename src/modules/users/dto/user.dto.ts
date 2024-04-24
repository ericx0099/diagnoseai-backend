import { IsNotEmpty, IsOptional, IsString, IsIn, MinLength } from "class-validator";

export class registerUserDTO {
    id: number;

    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsOptional()
    image: string;
}