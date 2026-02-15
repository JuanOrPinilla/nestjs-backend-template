/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';
import { ProjectTasksService } from './project-tasks.service';
import { ProjectTasksController } from './project-tasks.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Project, Task])],
  controllers: [ProjectTasksController],
  providers: [ProjectTasksService],
})
export class ProjectTasksModule {}
