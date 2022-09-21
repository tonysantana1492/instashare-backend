import { AuthGuard } from '@nestjs/passport';
import { Test, TestingModule } from '@nestjs/testing';
import { number, string } from 'joi';
import { User } from 'src/auth/user.entity';
import { FilemanagerController } from './filemanager.controller';
import { File } from './filemanager.entity';
import { FilemanagerService } from './filemanager.service';
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
        name: 'somename'
    }

    expect(await filemanagerController.updateName(updateNameParam.id, updateNameParam.name)).toEqual([file]);

    const updateNameSpy = jest.spyOn(filemanagerService, 'updateName'); 
    filemanagerController.updateName(updateNameParam.id, updateNameParam.name); 

    expect(updateNameSpy).toHaveBeenCalledWith(updateNameParam.id, updateNameParam.name);
    
  });
});
