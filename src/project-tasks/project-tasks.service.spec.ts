/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTasksService } from './project-tasks.service';
import { Project } from '../projects/project.entity';
import { Task } from '../tasks/task.entity';
import { BusinessErrorCode } from '../shared/errors/business-error';

describe('ProjectTasksService', () => {
  let service: ProjectTasksService;
  let projectRepository: Repository<Project>;
  let taskRepository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectTasksService,
        {
          provide: getRepositoryToken(Project),
          useValue: {
            findOne: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Task),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProjectTasksService>(ProjectTasksService);
    projectRepository = module.get<Repository<Project>>(
      getRepositoryToken(Project),
    );
    taskRepository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('add', () => {
    it('should create task with PENDING status on active project', async () => {
      const project = {
        id: 'p1',
        name: 'P1',
        isActive: true,
        createdAt: new Date(),
      };
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(project as Project);
      const created = {
        id: 't1',
        title: 'New Task',
        status: 'PENDING' as const,
        projectId: 'p1',
        createdAt: new Date(),
      };
      jest.spyOn(taskRepository, 'create').mockReturnValue(created as Task);
      jest.spyOn(taskRepository, 'save').mockResolvedValue(created as Task);
      const result = await service.add('p1', { title: 'New Task' });
      expect(result.status).toBe('PENDING');
      expect(taskRepository.create).toHaveBeenCalledWith({
        title: 'New Task',
        projectId: 'p1',
        status: 'PENDING',
      });
    });

    it('should throw NOT_FOUND when project does not exist', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(null);
      await expect(service.add('missing', { title: 'T1' })).rejects.toMatchObject(
        {
          code: BusinessErrorCode.NOT_FOUND,
          message: 'Project not found',
        },
      );
      expect(taskRepository.create).not.toHaveBeenCalled();
    });

    it('should throw PRECONDITION_FAILED when project is inactive', async () => {
      const project = {
        id: 'p1',
        name: 'P1',
        isActive: false,
        createdAt: new Date(),
      };
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(project as Project);
      await expect(service.add('p1', { title: 'T1' })).rejects.toMatchObject({
        code: BusinessErrorCode.PRECONDITION_FAILED,
        message: 'Cannot create task on inactive project',
      });
      expect(taskRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('findAllByProject', () => {
    it('should return tasks for project', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue({
        id: 'p1',
        name: 'P1',
        isActive: true,
        createdAt: new Date(),
      } as Project);
      const tasks = [
        {
          id: 't1',
          title: 'T1',
          status: 'PENDING' as const,
          projectId: 'p1',
          createdAt: new Date(),
        },
      ];
      jest.spyOn(taskRepository, 'find').mockResolvedValue(tasks as Task[]);
      const result = await service.findAllByProject('p1');
      expect(result).toEqual(tasks);
    });

    it('should throw NOT_FOUND when project does not exist', async () => {
      jest.spyOn(projectRepository, 'findOne').mockResolvedValue(null);
      await expect(service.findAllByProject('missing')).rejects.toMatchObject({
        code: BusinessErrorCode.NOT_FOUND,
        message: 'Project not found',
      });
    });
  });
});
