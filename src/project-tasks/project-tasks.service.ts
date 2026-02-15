/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';
import { BusinessError, BusinessErrorCode } from '../shared/errors/business-error';

@Injectable()
export class ProjectTasksService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async add(
    projectId: string,
    task: Partial<Pick<Task, 'title'>>,
  ): Promise<Task> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new BusinessError(BusinessErrorCode.NOT_FOUND, 'Project not found');
    }
    if (!project.isActive) {
      throw new BusinessError(
        BusinessErrorCode.PRECONDITION_FAILED,
        'Cannot create task on inactive project',
      );
    }
    const entity = this.taskRepository.create({
      title: task.title,
      projectId,
      status: 'PENDING',
    });
    return this.taskRepository.save(entity);
  }

  async findAllByProject(projectId: string): Promise<Task[]> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });
    if (!project) {
      throw new BusinessError(BusinessErrorCode.NOT_FOUND, 'Project not found');
    }
    return this.taskRepository.find({
      where: { projectId },
      relations: ['project'],
      order: { createdAt: 'DESC' },
    });
  }
}
