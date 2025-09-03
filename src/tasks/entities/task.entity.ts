// src/products/entities/task.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'tasks' })
export class TaskEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nome: string;

  @Column({ length: 500 })
  tarefa: string;

  @Column({
    type: 'enum',
    enum: ['FAZER', 'FEITA'],
    default: 'FAZER',
  })
  status: 'FAZER' | 'FEITA';

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
