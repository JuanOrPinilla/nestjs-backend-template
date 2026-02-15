/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { ProjectTasksService } from './project-tasks.service';
import { Task } from '../tasks/task.entity';
import { CreateTaskDto } from '../tasks/task.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('projects')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProjectTasksController {
  constructor(private readonly projectTasksService: ProjectTasksService) {}

  @Post(':projectId/tasks')
  @HttpCode(HttpStatus.CREATED)
  async add(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTaskDto,
  ): Promise<Task> {
    const task = plainToInstance(Task, dto);
    return this.projectTasksService.add(projectId, task);
  }

  @Get(':projectId/tasks')
  async findAll(@Param('projectId') projectId: string): Promise<Task[]> {
    return this.projectTasksService.findAllByProject(projectId);
  }
}
