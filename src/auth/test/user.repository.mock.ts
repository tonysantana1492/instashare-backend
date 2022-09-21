import { AuthCredentialsDto } from "../dto/auth-credentials.dto";
import { RegisterCredentialsDto } from "../dto/register-credentials.dto";


export class UserRepositoryMock {
   
    async register(registerCredentialsDto: RegisterCredentialsDto): Promise<any> {
        return Promise.resolve({
            id: Math.random() * (1000 - 1) + 1,
            ...registerCredentialsDto
          });
      
    }
  
    public async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<{id: number, username: string, displayname: string}> {
      
      delete authCredentialsDto.password;
      
      return Promise.resolve({
        id: Math.random() * (1000 - 1) + 1,
        displayname: 'somedisplayname',
        ...authCredentialsDto
      });
    }
  
   /* private async hashPassword(password: string, salt: string): Promise<string> {
    }*/
  }