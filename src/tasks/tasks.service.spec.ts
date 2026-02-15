/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { Project } from '../projects/project.entity';
import { BusinessErrorCode } from '../shared/errors/business-error';

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  const activeProject = {
    id: 'p1',
    name: 'P1',
    isActive: true,
    createdAt: new Date(),
  } as Project;

  const inactiveProject = {
    id: 'p2',
    name: 'P2',
    isActive: false,
    createdAt: new Date(),
  } as Project;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: {
            findOne: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return task when found', async () => {
      const task = {
        id: '1',
        title: 'T1',
        status: 'PENDING' as const,
        createdAt: new Date(),
        projectId: 'p1',
        project: activeProject,
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(task as Task);
      const result = await service.findOne('1');
      expect(result).toEqual(task);
    });

    it('should throw NOT_FOUND when task does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toMatchObject({
        code: BusinessErrorCode.NOT_FOUND,
        message: 'Task not found',
      });
    });
  });

  describe('update', () => {
    it('should update PENDING task', async () => {
      const task = {
        id: '1',
        title: 'T1',
        status: 'PENDING' as const,
        projectId: 'p1',
        project: activeProject,
        createdAt: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(task as Task);
      const updated = { ...task, title: 'T1 Updated' };
      jest.spyOn(repository, 'save').mockResolvedValue(updated as Task);
      const result = await service.update('1', { title: 'T1 Updated' });
      expect(result.title).toBe('T1 Updated');
    });

    it('should throw PRECONDITION_FAILED when task is DONE', async () => {
      const task = {
        id: '1',
        title: 'T1',
        status: 'DONE' as const,
        projectId: 'p1',
        project: activeProject,
        createdAt: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(task as Task);
      await expect(service.update('1', { title: 'New' })).rejects.toMatchObject({
        code: BusinessErrorCode.PRECONDITION_FAILED,
        message: 'Cannot edit a DONE task',
      });
    });

    it('should throw PRECONDITION_FAILED when project is inactive', async () => {
      const task = {
        id: '1',
        title: 'T1',
        status: 'PENDING' as const,
        projectId: 'p2',
        project: inactiveProject,
        createdAt: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(task as Task);
      await expect(service.update('1', { title: 'New' })).rejects.toMatchObject({
        code: BusinessErrorCode.PRECONDITION_FAILED,
        message: 'Cannot modify task of inactive project',
      });
    });
  });

  describe('complete', () => {
    it('should set status to DONE', async () => {
      const task = {
        id: '1',
        title: 'T1',
        status: 'PENDING' as const,
        projectId: 'p1',
        project: activeProject,
        createdAt: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(task as Task);
      const completed = { ...task, status: 'DONE' as const };
      jest.spyOn(repository, 'save').mockResolvedValue(completed as Task);
      const result = await service.complete('1');
      expect(result.status).toBe('DONE');
    });

    it('should throw PRECONDITION_FAILED when task is already DONE', async () => {
      const task = {
        id: '1',
        title: 'T1',
        status: 'DONE' as const,
        projectId: 'p1',
        project: activeProject,
        createdAt: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(task as Task);
      await expect(service.complete('1')).rejects.toMatchObject({
        code: BusinessErrorCode.PRECONDITION_FAILED,
        message: 'Task is already DONE',
      });
    });
  });

  describe('delete', () => {
    it('should delete PENDING task', async () => {
      const task = {
        id: '1',
        title: 'T1',
        status: 'PENDING' as const,
        projectId: 'p1',
        project: activeProject,
        createdAt: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(task as Task);
      jest.spyOn(repository, 'remove').mockResolvedValue(task as Task);
      await service.delete('1');
      expect(repository.remove).toHaveBeenCalledWith(task);
    });

    it('should throw PRECONDITION_FAILED when task is DONE', async () => {
      const task = {
        id: '1',
        title: 'T1',
        status: 'DONE' as const,
        projectId: 'p1',
        project: activeProject,
        createdAt: new Date(),
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(task as Task);
      await expect(service.delete('1')).rejects.toMatchObject({
        code: BusinessErrorCode.PRECONDITION_FAILED,
        message: 'Cannot delete a DONE task',
      });
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
