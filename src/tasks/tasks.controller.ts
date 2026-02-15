/* eslint-disable prettier/prettier */
import {
  Controller,
  Patch,
  Post,
  Delete,
  Body,
  Param,
  UseInterceptors,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { PatchTaskDto } from './task.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';

@Controller('tasks')
@UseInterceptors(BusinessErrorsInterceptor)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: PatchTaskDto,
  ): Promise<Task> {
    return this.tasksService.update(id, { title: dto.title });
  }

  @Post(':id/complete')
  async complete(@Param('id') id: string): Promise<Task> {
    return this.tasksService.complete(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    return this.tasksService.delete(id);
  }
}
