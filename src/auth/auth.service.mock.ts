import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';

export class AuthServiceMock {
  async register(
    registerCredentialsDto: RegisterCredentialsDto,
  ): Promise<{ token: string; user: object }> {
    return Promise.resolve({
      token: 'sometoken',
      user: {
        id: Math.random() * (1000 - 1) + 1,
        ...registerCredentialsDto,
      },
    });
  }

  async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{ token: string; user: object }> {
    return Promise.resolve({
      token: 'sometoken',
      user: {
        id: Math.random() * (1000 - 1) + 1,
        ...authCredentialsDto,
      },
    });
  }

  async accessToken(token: string): Promise<{ token: string; user: object }> {
    return Promise.resolve({
      token: 'sometoken',
      user: {
        id: Math.random() * (1000 - 1) + 1,
      },
    });
  }
}
