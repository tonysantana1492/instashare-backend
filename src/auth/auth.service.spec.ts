import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { JwtStrategy } from './jwt.strategy';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { UserRepositoryMock } from './user.repository.mock';

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService;
  let jwtStrategy;
  let userRepository;

  /*const mockUserRepository = () => ({
    register: jest.fn().mockImplementation((dto) => {
      return Promise.resolve({
        id: Math.random() * (1000 - 1) + 1,
        ...dto,
      });
    }),
    validateUserPassword: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  });*/

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

  const mockJwtStrategy = () => ({
    validate: jest.fn().mockImplementation(() => {
      return {
        id: 5,
        displayname: 'somedisplayname',
        username: 'someusername'
      };
    }),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserRepository,
          useClass: UserRepositoryMock,
        },
        {
          provide: JwtService,
          useFactory: mockJwtService,
        },
        {
          provide: JwtStrategy,
          useFactory: mockJwtStrategy,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<UserRepository>(UserRepository);
    jwtService = module.get<JwtService>(JwtService);
    jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
  });

  it('should be defined', () => {
    expect(AuthService).toBeDefined();
  });

  it('should register a user', async () => {
    const registerCredentialsDto: RegisterCredentialsDto = {
      username: 'some.username@gmail.com',
      displayname: 'some displayname',
      password: 'SomePassword2022',
    };

    expect(await authService.register(registerCredentialsDto)).toEqual({
      token: expect.any(String),
      user: {
        id: expect.any(Number),
        ...registerCredentialsDto,
      },
    });

    const registerSpy = jest.spyOn(authService, 'register'); 
    authService.register(registerCredentialsDto); 
    
    expect(registerSpy).toHaveBeenCalledWith(registerCredentialsDto);
  });

  it('should login a user', async () => {
    const authCredentialsDto: AuthCredentialsDto = {
      username: 'some.username@gmail.com',
      password: 'SomePassword2022',
    };

    expect(await authService.signIn(authCredentialsDto)).toEqual({
      token: expect.any(String),
      user: {
        id: expect.any(Number),
        displayname: expect.any(String),
        ...authCredentialsDto,
      },
    });

    const signInSpy = jest.spyOn(authService, 'signIn'); 
    authService.signIn(authCredentialsDto); 
    
    expect(signInSpy).toHaveBeenCalledWith(authCredentialsDto);
  });

  it('should refresh token', async () => {
    
    const token = 'sometoken';
   

    expect(await authService.accessToken(token)).toEqual({
      token: expect.any(String),
      user: {
        id: expect.any(Number),
        displayname: expect.any(String),
        username: expect.any(String)
      },
    });

    const accessTokenSpy = jest.spyOn(authService, 'accessToken'); 
    authService.accessToken(token); 
    
    expect(accessTokenSpy).toHaveBeenCalledWith(token);
  });

});
