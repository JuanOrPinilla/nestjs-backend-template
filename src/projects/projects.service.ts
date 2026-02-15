/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './project.entity';
import { BusinessError, BusinessErrorCode } from '../shared/errors/business-error';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ['tasks'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['tasks'],
    });
    if (!project) {
      throw new BusinessError(BusinessErrorCode.NOT_FOUND, 'Project not found');
    }
    return project;
  }

  async create(project: Partial<Project>): Promise<Project> {
    const entity = this.projectRepository.create({
      ...project,
      isActive: project.isActive ?? true,
    });
    return this.projectRepository.save(entity);
  }

  async update(id: string, project: Partial<Project>): Promise<Project> {
    const existing = await this.findOne(id);
    Object.assign(existing, project);
    return this.projectRepository.save(existing);
  }

  async delete(id: string): Promise<void> {
    const project = await this.findOne(id);
    if (project.tasks && project.tasks.length > 0) {
      throw new BusinessError(
        BusinessErrorCode.PRECONDITION_FAILED,
        'Cannot delete project with tasks',
      );
    }
    await this.projectRepository.remove(project);
  }
}
