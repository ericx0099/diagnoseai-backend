import { IsNotEmpty, IsOptional, IsString, IsIn, MinLength, IsEmail } from "class-validator";

export class registerUserDTO {
    id: number;

    @IsString()
    name: string;

    @IsString()
    email: string;

    @IsOptional()
    image: string;
}

export class emailDTO{
    @IsString()
    @IsEmail()
    email:string;
}