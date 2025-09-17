// src/tasks/tasks.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './entities/task.entity';
import { createTaskDto } from './dto/create-task.dto';
import { updateTaskDto } from './dto/update-task.dto';
import { PaginationResponseDto } from '../common/dto/pagination-response.dto';

interface FindAllOptions {
  page: number;
  limit: number;
}

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly taskRepository: Repository<TaskEntity>,
  ) {}

  async create(createTaskDto: createTaskDto, userId: number): Promise<TaskEntity> {
    // Cria a task associada ao usuário logado
    const newTask = this.taskRepository.create({
      ...createTaskDto,
      user: { id: userId }, // precisa de relação ManyToOne no entity
    });

    return await this.taskRepository.save(newTask);
  }

  async findAll(options: FindAllOptions): Promise<PaginationResponseDto<TaskEntity>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [data, total] = await this.taskRepository.findAndCount({
      skip,
      take: limit,
      relations: ['user'], // para trazer dados do usuário
      order: { createdAt: 'DESC' },
    });

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: number): Promise<TaskEntity> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!task) {
      throw new NotFoundException(`Tarefa com ID #${id} não encontrada.`);
    }

    return task;
  }

  async update(id: number, updateTaskDto: updateTaskDto): Promise<TaskEntity> {
    const task = await this.taskRepository.preload({
      id,
      ...updateTaskDto,
    });

    if (!task) {
      throw new NotFoundException(`Tarefa com ID #${id} não encontrada para atualizar.`);
    }

    return await this.taskRepository.save(task);
  }

  async remove(id: number): Promise<void> {
    const task = await this.findOne(id);
    await this.taskRepository.remove(task);
  }
}
