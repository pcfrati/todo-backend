import { IsString, IsNotEmpty } from "class-validator";

export class createTaskDto{
    @IsString()
    @IsNotEmpty()
    nome: string;

    @IsString()
    @IsNotEmpty()
    tarefa: string;
}