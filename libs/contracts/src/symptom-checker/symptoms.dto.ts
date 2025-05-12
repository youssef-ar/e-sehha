import { IsNotEmpty, IsString } from "class-validator";

export class SymptomCheckerDto {
    @IsString()
    @IsNotEmpty()
    symptoms: string;
};