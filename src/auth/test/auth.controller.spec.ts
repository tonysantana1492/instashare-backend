import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { AuthServiceMock } from './auth.service.mock';
import { AuthCredentialsDto } from '../dto/auth-credentials.dto';
import { RegisterCredentialsDto } from '../dto/register-credentials.dto';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {

    const AuthServiceProvider = {
        provide: AuthService,
        useClass: AuthServiceMock,
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService, AuthServiceProvider],
    })
      .overrideProvider(AuthService)
      .useClass(AuthServiceMock)
      .compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  it('should register a user', async () => {
    const registerCredentialsDto: RegisterCredentialsDto = {
      username: 'some.username@gmail.com',
      displayname: 'some displayname',
      password: 'SomePassword2022',
    };

    expect(await authController.register(registerCredentialsDto)).toEqual({
      token: expect.any(String),
      user: {
        id: expect.any(Number),
        ...registerCredentialsDto,
      },
    });

    const registerSpy = jest.spyOn(authService, 'register'); 
    authController.register(registerCredentialsDto); 

    expect(registerSpy).toHaveBeenCalledWith(registerCredentialsDto); 
    
  });

  it('should signin a user', async () => {
    const authCredentialsDto: AuthCredentialsDto = {
      username: 'some username',
      password: 'SomePassword2022',
    };

    expect(await authController.signIn(authCredentialsDto)).toEqual({
      token: expect.any(String),
      user: {
        id: expect.any(Number),
        ...authCredentialsDto,
      },
    });

    const signinSpy = jest.spyOn(authService, 'signIn'); 
    authController.signIn(authCredentialsDto); 

    expect(signinSpy).toHaveBeenCalledWith(authCredentialsDto); 
    
  });

  it('should update token', async () => {

    const token: string = 'sometoken';

    expect(await authController.accessToken(token)).toEqual({
      token: expect.any(String),
      user: {
        id: expect.any(Number)
      },
    });

    const accessTokenSpy = jest.spyOn(authService, 'accessToken'); 
    authController.accessToken(token); 

    expect(accessTokenSpy).toHaveBeenCalledWith(token); 
    
  });

});
