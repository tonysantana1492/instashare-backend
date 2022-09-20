import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

describe("authController Unit Tests", () => {
  let controller: AuthController;
  let service: AuthService;
  let mockedFizzBuzzValue = 'Buzz'; 
  let mockFizzBuzzService = { 
    fizzbuzz: () => mockedFizzBuzzValue, 
    create: jest.fn((dto) => { 
      return {
        id: Math.random() * (1000 - 1) + 1,
        ...dto,
      };
    }),
    update: jest.fn((id, dto) => { 
      return {
        id: id,
        ...dto,
      };
    }),
  };

  /*beforeAll(async () => {
    const ApiServiceProvider = {
      provide: AuthService,
      useFactory: () => ({
        register: jest.fn(() => []),
        signIn: jest.fn(() => []),
        accessToken: jest.fn(() => { }),
      })
    }
    const app: TestingModule = await Test.createTestingModule({
      controllers: [authController],
      providers: [AuthService, ApiServiceProvider],
    }).compile();

    authController = app.get<authController>(authController);
    spyService = app.get<AuthService>(AuthService);
  })*/
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService], 
    })
    .overrideProvider(AuthService) 
    .useValue(mockFizzBuzzService) 
    .compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService); 
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return the correct Fizz Buzz word according the introduced number (Using spyOn)', () => {
    const result = 'Fizz';

    const fizzbuzzSpy = jest.spyOn(service, 'fizzbuzz');
    fizzbuzzSpy.mockImplementation(() => result);

    expect(controller.fizzbuzz(3)).toBe(result);

    fizzbuzzSpy.mockRestore();
  });

  it('should return the correct Fizz Buzz word according the introduced number (Using mocking de servicios)', () => { 
    expect(controller.fizzbuzz(5)).toBe(mockedFizzBuzzValue); 
  });

  //////////////////////////////////////

  it('should create a solicitud', () => {
    const createSolicitudDto: CreateSolicitudDto = { 
      nombre: 'John Doe',
      cargo: 'Assistant Professor',
      unidad: 'Informatics Department',
      telefono: '1234',
      email: 'john.doe@gmail.com',
      tipo: '',
      nombreActividad: '',
      start: undefined,
      end: undefined,
      dia: '',
      horaInicio: '',
      horaFin: '',
    };

    expect(controller.create(createSolicitudDto)).toEqual({ 
      id: expect.any(Number),
      ...createSolicitudDto,
    });
  });




  it("calling saveNotes method", () => {
    const dto = new AuthCredentialsDto();
    expect(authController.saveNote(dto)).not.toEqual(null);
  })

  it("calling saveNotes method", () => {
    const dto = new AuthCredentialsDto();
    authController.saveNote(dto);
    expect(spyService.saveNote).toHaveBeenCalled();
    expect(spyService.saveNote).toHaveBeenCalledWith(dto);
  })

  it("calling getAllNote method", () => {
    authController.getAllNote();
    expect(spyService.findAllNotes).toHaveBeenCalled();
  })

  it("calling find NoteById method", () => {
    const dto = new GetNoteById();
    dto.id = '3789';
    authController.getNoteById(dto);
    expect(spyService.findOneNote).toHaveBeenCalled();
  })

});