// src/users/entities/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Role } from '../../common/enum/role.enum'; // 1. Importar o Enum
import { TaskEntity } from 'src/tasks/entities/task.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  // 2. Adicionar a nova coluna 'role'
  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User, // Todo novo usuário será 'user' por padrão
  })
  role: Role;

  @OneToMany(() => TaskEntity, (task) => task.user)
  tasks: TaskEntity[];
}