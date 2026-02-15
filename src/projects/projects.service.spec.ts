/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectsService } from './projects.service';
import { Project } from './project.entity';
import { BusinessErrorCode } from '../shared/errors/business-error';

describe('ProjectsService', () => {
  let service: ProjectsService;
  let repository: Repository<Project>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectsService,
        {
          provide: getRepositoryToken(Project),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ProjectsService>(ProjectsService);
    repository = module.get<Repository<Project>>(getRepositoryToken(Project));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      const projects = [
        { id: '1', name: 'P1', isActive: true, createdAt: new Date(), tasks: [] },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(projects as Project[]);
      const result = await service.findAll();
      expect(result).toEqual(projects);
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['tasks'],
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return project when found', async () => {
      const project = {
        id: '1',
        name: 'P1',
        isActive: true,
        createdAt: new Date(),
        tasks: [],
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(project as Project);
      const result = await service.findOne('1');
      expect(result).toEqual(project);
    });

    it('should throw NOT_FOUND when project does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      await expect(service.findOne('missing')).rejects.toMatchObject({
        code: BusinessErrorCode.NOT_FOUND,
        message: 'Project not found',
      });
    });
  });

  describe('create', () => {
    it('should create project with isActive true by default', async () => {
      const input = { name: 'New' };
      const created = {
        id: '1',
        name: 'New',
        isActive: true,
        createdAt: new Date(),
      };
      jest.spyOn(repository, 'create').mockReturnValue(created as Project);
      jest.spyOn(repository, 'save').mockResolvedValue(created as Project);
      const result = await service.create(input);
      expect(result.isActive).toBe(true);
      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({ name: 'New', isActive: true }),
      );
    });
  });

  describe('delete', () => {
    it('should delete project when it has no tasks', async () => {
      const project = {
        id: '1',
        name: 'P1',
        isActive: true,
        createdAt: new Date(),
        tasks: [],
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(project as Project);
      jest.spyOn(repository, 'remove').mockResolvedValue(project as Project);
      await service.delete('1');
      expect(repository.remove).toHaveBeenCalledWith(project);
    });

    it('should throw PRECONDITION_FAILED when project has tasks', async () => {
      const project = {
        id: '1',
        name: 'P1',
        isActive: true,
        createdAt: new Date(),
        tasks: [{ id: 't1', title: 'T1', status: 'PENDING' }],
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(project as Project);
      await expect(service.delete('1')).rejects.toMatchObject({
        code: BusinessErrorCode.PRECONDITION_FAILED,
        message: 'Cannot delete project with tasks',
      });
      expect(repository.remove).not.toHaveBeenCalled();
    });
  });
});
