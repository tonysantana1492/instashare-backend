import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test, TestingModule } from '@nestjs/testing';
import { User } from 'src/auth/user.entity';
import { CreateFileDto } from '../dto/create-file.dto';
import { File } from '../filemanager.entity';
import { FilemanagerRepository } from '../filemanager.repository';
import { FilemanagerService } from '../filemanager.service';
import { FilemanagerRepositoryMock } from './filemanager.repository.mock';
import fs from 'fs';

describe('FilemanagerService', () => {
  let filemanagerService: FilemanagerService;
  let eventEmitter;
  let filemanagerRepository;

  const mockEventEmitter = () => ({
    emit: jest.fn().mockImplementation(() => {
      return 'dispatch some event';
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilemanagerService,
        {
          provide: FilemanagerRepository,
          useClass: FilemanagerRepositoryMock,
        },
        {
          provide: EventEmitter2,
          useFactory: mockEventEmitter,
        },
      ],
    }).compile();

    filemanagerService = module.get<FilemanagerService>(FilemanagerService);
    filemanagerRepository = module.get<FilemanagerRepository>(
      FilemanagerRepository,
    );
    eventEmitter = module.get<EventEmitter2>(EventEmitter2);
  });

  it('should be defined', () => {
    expect(filemanagerService).toBeDefined();
  });

  it('should get all files', async () => {
    const file: CreateFileDto = new File();

    expect(await filemanagerService.getAll()).toEqual([file]);

    const getAllSpy = jest.spyOn(filemanagerService, 'getAll');
    filemanagerService.getAll();

    expect(getAllSpy).toHaveBeenCalledWith();
  });

  it('should find a file by id', async () => {
    const file: CreateFileDto = new File();
    const fileId = 5;

    expect(await filemanagerService.getFileById(fileId)).toEqual(file);

    const getFileByIdSpy = jest.spyOn(filemanagerService, 'getFileById');
    filemanagerService.getFileById(fileId);

    expect(getFileByIdSpy).toHaveBeenCalledWith(fileId);
  });

  it('should update a name file', async () => {
    const file: CreateFileDto = new File();
    const fileId = 5;
    const newName = 'some new name';

    expect(await filemanagerService.updateName(fileId, newName)).toEqual([
      file,
    ]);

    const updateNameSpy = jest.spyOn(filemanagerService, 'updateName');
    filemanagerService.updateName(fileId, newName);

    expect(updateNameSpy).toHaveBeenCalledWith(fileId, newName);
  });

  it('should upload a file', async () => {
    const user = new User();
    const file = new File();

    const mockFile = {
      fieldname: 'file',
      originalname: 'TradeHistory.csv',
      encoding: '7bit',
      mimetype: 'text/csv',
      buffer: Buffer.from(__dirname + '/../../example.csv', 'utf8'),
      size: 51828,
    } as Express.Multer.File;

    expect(await filemanagerService.uploadFile(mockFile, user)).toEqual([file]);

    const uploadFileSpy = jest.spyOn(filemanagerService, 'uploadFile');
    filemanagerService.uploadFile(mockFile, user);

    expect(uploadFileSpy).toHaveBeenCalledWith(mockFile, user);
  });

  /*it('should download a file', async () => {
    const user = new User();
    const file = new File();
    const fileId = 5;

    const mockFile = {
      fieldname: 'file',
      originalname: 'TradeHistory.csv',
      encoding: '7bit',
      mimetype: 'text/csv',
      buffer: Buffer.from(__dirname + '/../../example.csv', 'utf8'),
      size: 51828,
    } as Express.Multer.File;

    
    expect(await filemanagerService.downloadFile(fileId)).toEqual(mockFile);

    const downloadFileSpy = jest.spyOn(filemanagerService, 'downloadFile');
    filemanagerService.downloadFile(fileId);

    expect(downloadFileSpy).toHaveBeenCalledWith(fileId);
  });*/

});
