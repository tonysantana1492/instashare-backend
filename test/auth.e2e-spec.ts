import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserRepository } from 'src/auth/user.repository';
import { File } from 'src/filemanager/filemanager.entity';
import { object } from 'joi';

const userLogin = {
  username: 'some.username@gmail.com',
  password: 'SomePassword1234',
  // displayname: 'some displayname',
};

const userRegister = {
  username: 'some.username@gmail.com',
  password: 'SomePassword1234',
  displayname: 'some displayname',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let user: User;
  let file: File;

  /*const file: File = {
    id: 5,
    url: 'someurl',
    name: 'somename',
    ext: 'someextension', 
    type: 'sometype0',
    size: 25,
    status: true,
    //user: ,
    userId: 5,
    createdAt: new Date(),  
    updateAt: new Date()
  };*/

  const mockUserRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    })
      .overrideProvider(UserRepository)
      .useValue(mockUserRepository)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer()).post('/auth/register').expect(201);
  });
});
