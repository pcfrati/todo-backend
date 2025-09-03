import { IsString, IsIn, IsOptional } from "class-validator";

export class updateTaskDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    tarefa?: string;

    @IsOptional()
    @IsIn(['FAZER', 'FEITA'])
    status?: 'FAZER' | 'FEITA';
}
