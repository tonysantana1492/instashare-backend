import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

jest.mock('got', () => {
  return {
    post: jest.fn(),
  };
});

const testUser = {
  email: 'tonysantana1492@gmail.com',
  password: 'TonySantana1492',
};

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('createAccount', () => {
    it('should create account', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                user: { id, username, displayname },
                token,
              },
            },
          } = res;
          expect(token).toEqual(expect.any(String));
          expect(username).not.toBe(null);
          jwtToken = token;
        });
    });

    it('should fail if account already exists', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                error: { type, message },
              },
            },
          } = res;
          expect(type).toBe('username');
          expect(message).toBe('Username already exists');
        });
    });
  });

  describe('login', () => {
    it('should login with correct credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                user: { id, username, displayname },
                token,
              },
            },
          } = res;
          expect(token).toEqual(expect.any(String));
          expect(username).not.toBe(null);
          jwtToken = token;
        });
    });

    it('should not be able to login with wrong credentials', () => {
      return request(app.getHttpServer())
        .post('/auth/signin')
        .expect(200)
        .expect((res) => {
          const {
            body: {
              data: {
                error: { type, message },
              },
            },
          } = res;
          expect(message).toBe('Invalid credentials');
        });
    });
  });
});
