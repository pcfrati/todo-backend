// src/tasks/tasks.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TasksService } from './tasks.service';
import { createTaskDto } from './dto/create-task.dto';
import { updateTaskDto } from './dto/update-task.dto';
import { TaskEntity } from './entities/task.entity';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../common/enum/role.enum';
import { RolesGuard } from '../auth/guards/roles.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { UserPayload } from '../auth/interfaces/user-payload.interface';

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}
 
  @Post()
  async create(
    @Body() createTaskDto: createTaskDto,
    @GetUser() user: UserPayload,
  ): Promise<TaskEntity> {
    const userId = user.userId;
    return await this.tasksService.create(createTaskDto, userId);
  }

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    // Proteção contra paginação exagerada
    limit = limit > 100 ? 100 : limit;
    return await this.tasksService.findAll({ page, limit });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<TaskEntity> {
    return await this.tasksService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: updateTaskDto,
  ): Promise<TaskEntity> {
    return await this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return await this.tasksService.remove(id);
  }
}
