/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './task.entity';
import { BusinessError, BusinessErrorCode } from '../shared/errors/business-error';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findOne(id: string): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['project'],
    });
    if (!task) {
      throw new BusinessError(BusinessErrorCode.NOT_FOUND, 'Task not found');
    }
    return task;
  }

  async update(id: string, updates: Partial<Pick<Task, 'title'>>): Promise<Task> {
    const task = await this.findOne(id);
    if (task.status === 'DONE') {
      throw new BusinessError(
        BusinessErrorCode.PRECONDITION_FAILED,
        'Cannot edit a DONE task',
      );
    }
    if (!task.project.isActive) {
      throw new BusinessError(
        BusinessErrorCode.PRECONDITION_FAILED,
        'Cannot modify task of inactive project',
      );
    }
    Object.assign(task, updates);
    return this.taskRepository.save(task);
  }

  async complete(id: string): Promise<Task> {
    const task = await this.findOne(id);
    if (task.status === 'DONE') {
      throw new BusinessError(
        BusinessErrorCode.PRECONDITION_FAILED,
        'Task is already DONE',
      );
    }
    task.status = 'DONE';
    return this.taskRepository.save(task);
  }

  async delete(id: string): Promise<void> {
    const task = await this.findOne(id);
    if (task.status === 'DONE') {
      throw new BusinessError(
        BusinessErrorCode.PRECONDITION_FAILED,
        'Cannot delete a DONE task',
      );
    }
    await this.taskRepository.remove(task);
  }
}
