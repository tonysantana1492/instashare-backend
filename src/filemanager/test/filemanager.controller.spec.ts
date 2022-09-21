import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { User } from 'src/auth/user.entity';
import { Readable } from 'stream';
import { FilemanagerController } from '../filemanager.controller';
import { File } from '../filemanager.entity';
import { FilemanagerService } from '../filemanager.service';
import { FilemanagerServiceMock } from './filemanager.service.mock';

describe('FilemanagerController', () => {
  let filemanagerController: FilemanagerController;
  let filemanagerService: FilemanagerService;

  beforeEach(async () => {
    const FilemanagerServiceProvider = {
      provide: FilemanagerService,
      useClass: FilemanagerServiceMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilemanagerController],
      providers: [FilemanagerService, FilemanagerServiceProvider],
    })
      .overrideGuard(AuthGuard())
      .useValue('')
      .overrideProvider(filemanagerService)
      .useClass(FilemanagerServiceMock)
      .compile();

    filemanagerController = module.get<FilemanagerController>(
      FilemanagerController,
    );
    filemanagerService = module.get<FilemanagerService>(FilemanagerService);
  });

  it('should be defined', () => {
    expect(filemanagerController).toBeDefined();
  });

  it('getAll files', async () => {
    const user = new User();
    const file = new File();

    expect(await filemanagerController.getAll(user)).toEqual([file]);

    const getAllSpy = jest.spyOn(filemanagerService, 'getAll');
    filemanagerController.getAll(user);

    expect(getAllSpy).toHaveBeenCalledWith();
  });

  it('update name files', async () => {
    const file = new File();
    const updateNameParam = {
      id: 5,
      name: 'somename',
    };

    expect(
      await filemanagerController.updateName(
        updateNameParam.id,
        updateNameParam.name,
      ),
    ).toEqual([file]);

    const updateNameSpy = jest.spyOn(filemanagerService, 'updateName');
    filemanagerController.updateName(updateNameParam.id, updateNameParam.name);

    expect(updateNameSpy).toHaveBeenCalledWith(
      updateNameParam.id,
      updateNameParam.name,
    );
  });

  it('upload a files', async () => {
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

    expect(await filemanagerController.uploadFile(mockFile, user)).toEqual([
      file,
    ]);

    const uploadfileSpy = jest.spyOn(filemanagerService, 'uploadFile');
    filemanagerController.uploadFile(mockFile, user);

    expect(uploadfileSpy).toHaveBeenCalledWith(mockFile, user);
  });

  it('download a files', async () => {
    const user = new User();
    const fileId = 5;

    const mockFile = {
      fieldname: 'file',
      originalname: 'TradeHistory.csv',
      encoding: '7bit',
      mimetype: 'text/csv',
      buffer: Buffer.from(__dirname + '/../../example.csv', 'utf8'),
      size: 51828,
    } as Express.Multer.File;

    let responseObject = {
      status: 200,
      message: 'Hello World!',
    };

    const response: Partial<Response> = {
      status: jest.fn().mockImplementation().mockReturnValue(200),
      json: jest.fn().mockImplementation().mockReturnValue(responseObject),
      contentType: jest.fn().mockImplementation().mockReturnValue('text/csv'),
      attachment: jest.fn().mockImplementation().mockReturnValue(mockFile),
      send: jest.fn().mockImplementation().mockReturnValue(mockFile),
    };

    expect(
      await filemanagerController.downloadById(
        fileId,
        user,
        response as Response,
      ),
    ).toEqual(mockFile);

    const downloadFileSpy = jest.spyOn(filemanagerService, 'downloadFile');
    filemanagerController.downloadById(fileId, user, response as Response);

    expect(downloadFileSpy).toHaveBeenCalledWith(fileId);
  });
});
