//tasks.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './entities/task.entity';
import { createTaskDto } from './dto/create-task.dto';
import { updateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async create(createTaskDto: createTaskDto): Promise<TaskEntity> {
    // Cria uma instância da entidade com base no DTO, mas ainda não salva no banco.
    const newTask = this.taskRepository.create(createTaskDto);
    // Salva a entidade no banco de dados e retorna o resultado.
    return await this.taskRepository.save(newTask);
  }

  async findAll(): Promise<TaskEntity[]> {
    return await this.taskRepository.find();
  }

  async findOne(id: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOneBy({ id });

    if (!task) {
      throw new NotFoundException(`Tarefa com ID #${id} não encontrado.`);



    }

    return task;
  }

  async update(id: number, updateTaskDto: updateTaskDto): Promise<TaskEntity> {
    const task = await this.taskRepository.preload({
      id: id,
      ...updateTaskDto,
    });

    if (!task) {
      throw new NotFoundException(`Tarefa com ID #${id} não encontrado para atualizar.`);
    }

    return await this.taskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);

    await this.taskRepository.remove(task);
  }
}