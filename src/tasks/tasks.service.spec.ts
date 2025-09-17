import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskEntity } from './entities/task.entity';
import { Role } from '../common/enum/role.enum';

const mockTaskRepository = { findOne: jest.fn(), findAndCount: jest.fn(), create: jest.fn(), save: jest.fn(), preload: jest.fn(), remove: jest.fn() };
const mockTask: TaskEntity = {
  id: 1,
  nome: 'Test Task',
  tarefa: 'Test description',
  status: 'FAZER',
  createdAt:
        new Date(), user: {
            id: 1, email: 't@t.com', password: 'p', role: Role.User,
            tasks: []
  },
};

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<TaskEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(TaskEntity),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<TaskEntity>>(getRepositoryToken(TaskEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a task if it exists', async () => {
      mockTaskRepository.findOne.mockResolvedValue(mockTask);

      const result = await service.findOne(1);
      expect(result).toEqual(mockTask);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['user'],
      });
    });

    it('should throw NotFoundException if task not found', async () => {
      mockTaskRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and save a task', async () => {
      mockTaskRepository.create.mockReturnValue(mockTask);
      mockTaskRepository.save.mockResolvedValue(mockTask);

      const result = await service.create({ nome: 'Test Task', tarefa: 'Test description', status: 'FAZER' }, 1);
      expect(result).toEqual(mockTask);
      expect(repository.create).toHaveBeenCalledWith({
        nome: 'Test Task',
        tarefa: 'Test description',
        status: 'FAZER',
        user: { id: 1 },
      });
      expect(repository.save).toHaveBeenCalledWith(mockTask);
    });
  });
});
