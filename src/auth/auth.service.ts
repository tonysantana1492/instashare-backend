import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthResponseInterface } from './auth-response.interface';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';
import { JwtPayload } from './jwt-payload.interface';
import { JwtStrategy } from './jwt.strategy';
import { UserRepository } from './user.repository';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    private userRepository: UserRepository,
    private jwtService: JwtService,
    private jwtStrategy: JwtStrategy,
  ) {}

  async register(registerCredentialsDto: RegisterCredentialsDto): Promise<any> {
    this.logger.debug(
      `Nuevo usuario creado: ${JSON.stringify(registerCredentialsDto)}`,
    );

    try {
      const newUser = await this.userRepository.register(
        registerCredentialsDto,
      );

      const { id, username, displayname } = newUser;
      const payload: JwtPayload = { id, displayname, username };

      const token = await this.jwtService.sign(payload);

      const response: AuthResponseInterface = { token, user: newUser };
      return response;
    } catch (e) {
      const response = [
        {
          type: 'username',
          message: e.response.message,
        },
      ];

      return { error: response };
    }
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<any> {
    const user = await this.userRepository.validateUserPassword(
      authCredentialsDto,
    );

    if (!user) {
      // throw new UnauthorizedException('Invalid credentials');
      const response = [
        {
          type: 'password',
          message: 'Invalid credentials',
        },
      ];

      return { error: response };
    }

    const { id, username, displayname } = user;

    const payload: JwtPayload = { id, displayname, username };
    const token = await this.jwtService.sign(payload);
    this.logger.debug(
      `Generated JWT Token with payload ${JSON.stringify(payload)}`,
    );

    const response: AuthResponseInterface = {
      token,
      user: { id, username, displayname },
    };

    return response;
  }

  async accessToken(token: string): Promise<{ token: string; user: object }> {
    let payloadToken;

    try {
      payloadToken = await this.jwtService.verify(token);
    } catch (error) {
      throw new UnauthorizedException('Token No Valido');
    }

    const user = await this.jwtStrategy.validate(payloadToken);

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    const { id, username, displayname } = user;

    const newPayload: JwtPayload = { id, username, displayname };

    const updateToken = await this.jwtService.sign(newPayload);
    this.logger.debug(
      `Update JWT Token with payload ${JSON.stringify(newPayload)}`,
    );

    const response: AuthResponseInterface = {
      token: updateToken,
      user: {
        id: user.id,
        username: user.username,
        displayname: user.displayname,
      },
    };

    return response;
  }
}
