import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/user.entity';
import { UserRepository } from 'src/auth/user.repository';
import { File } from 'src/filemanager/filemanager.entity';
import { ConfigModule } from '@nestjs/config';
import { UserRepositoryMock } from 'src/auth/test/user.repository.mock';
import { JwtService } from '@nestjs/jwt';

const userLogin = {
  username: 'some.username@gmail.com',
  password: 'SomePassword1234'
};

const userRegister = {
  username: 'some.username@gmail.com',
  password: 'SomePassword1234',
  displayname: 'some displayname',
};

const refreshToken = {
  token: 'sometoken',
};

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  const mockJwtService = () => ({
    sign: jest.fn().mockImplementation(() => {
      return 'sometoken';
    }),
    verify: jest.fn().mockImplementation(() => {
      return {
        id: 5,
        displayname: 'somedisplayname',
        username: 'someusername'
      };
    }),
    
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule, AppModule],
      providers: [
        {
          provide: UserRepository,
          useClass: UserRepositoryMock,
        },
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
      ],
    })      
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send(userRegister)
      .expect(201);
  });

  it('should signin a user', () => {
    return request(app.getHttpServer())
      .post('/auth/signin')
      .send(userLogin)
      .expect(201)
  });

  /*it('should refresh token a user', () => {
    return request(app.getHttpServer())
      .post('/auth/access-token')
      .send(refreshToken)
      .expect(201)
  });*/

});
