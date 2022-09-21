import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { FilemanagerModule } from 'src/filemanager/filemanager.module';
import { FilemanagerRepository } from 'src/filemanager/filemanager.repository';
import { FilemanagerRepositoryMock } from 'src/filemanager/test/filemanager.repository.mock';
import { AuthGuard } from '@nestjs/passport';
import { File } from 'src/filemanager/filemanager.entity';
import { User } from 'src/auth/user.entity';

describe('FilemanagerController (e2e)', () => {
  let app: INestApplication;

  const file: File = new File();
  const user = new User();
  file.id = 10;
  file.name = 'name';
  file.ext = 'ext';
  file.type = 'type';
  file.size = 23;
  file.url = 'url';
  file.user = user;

  const mockSolicitudRepository = {
    find: jest.fn((id) => {
      return Promise.resolve([file]);
    }),
    findOne: jest.fn((id) => {
      return Promise.resolve(file);
    }),
    save: jest.fn((id) => {
      return Promise.resolve(file);
    }),
    delete: jest.fn(),

    updateName: jest.fn((id) => {
      return Promise.resolve(file);
    }),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [FilemanagerModule, AppModule],
      /*providers: [
        {
          provide: FilemanagerRepository,
          useClass: FilemanagerRepositoryMock,
        },
      ],*/
    })
      .overrideGuard(AuthGuard())
      .useValue('')
      .overrideProvider(FilemanagerRepository)
      .useValue(mockSolicitudRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/filemanager (GET)', () => {
    return request(app.getHttpServer()).get('/filemanager').expect(200);
  });

  it('/filemanager/:id/name (PATCH)', () => {
    return request(app.getHttpServer())
      .patch('/filemanager/10/name')
      .send({ name: 'amcharts_5.2.7' })
      .expect(200);
  });

  /*it('/filemanager/upload (POST)', () => {

    const mockFile = {
        fieldname: 'file',
        originalname: 'TradeHistory.csv',
        encoding: '7bit',
        mimetype: 'text/csv',
        buffer: Buffer.from(__dirname + '/../../example.csv', 'utf8'),
        size: 51828,
      } as Express.Multer.File;

      const formData = new FormData();
      formData.append('file', mockFile)
    
    return request(app.getHttpServer())
      .post('/filemanager/upload')
      .set('Content-Type', 'multipart/form-data')
      .attach('file', formData)
      .expect(200);
  });

  /*it('/filemanager/download/:id (GET)', () => {
    return request(app.getHttpServer())
      .get('/filemanager/download/10')
      .expect(200);
  });*/
});
