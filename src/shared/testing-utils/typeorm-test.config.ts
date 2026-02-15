/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../projects/project.entity';
import { Task } from '../../tasks/task.entity';

export const getTypeOrmTestModule = () =>
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    synchronize: true,
    entities: [Project, Task],
  });

export const getTypeOrmTestFeature = () =>
  TypeOrmModule.forFeature([Project, Task]);
