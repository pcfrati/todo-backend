import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';

export class createTaskDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsString()
  @IsNotEmpty()
  tarefa: string;

  @IsEnum(['FAZER', 'FEITA'])
  @IsOptional()
  status?: 'FAZER' | 'FEITA';
}
