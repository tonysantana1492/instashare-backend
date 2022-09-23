import { Test, TestingModule } from '@nestjs/testing';
import { ConvertToZipService } from '../convet-to-zip.service';
import { File } from '../filemanager.entity';
import { FilemanagerRepository } from '../filemanager.repository';
import { FilemanagerRepositoryMock } from './filemanager.repository.mock';

describe('FilemanagerService', () => {
  let convertToZipService: ConvertToZipService;
  let filemanagerRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ConvertToZipService,
        {
          provide: FilemanagerRepository,
          useClass: FilemanagerRepositoryMock,
        },       
      ],
    }).compile();

    convertToZipService = module.get<ConvertToZipService>(ConvertToZipService);
    filemanagerRepository = module.get<FilemanagerRepository>(
      FilemanagerRepository,
    );
  });

  it('should be defined', () => {
    expect(convertToZipService).toBeDefined();
  });

});
