import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(private dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  //SIGNUP
  async register(registerCredentialsDto: RegisterCredentialsDto): Promise<User> {
    
    const {displayname, username, password } = registerCredentialsDto;

    const salt = await bcrypt.genSalt();
    const user = new User();
    user.displayname = displayname;
    user.username = username;
    user.salt = salt;
    user.password = await this.hashPassword(password, salt);

    let newUser;

    try {
      newUser = await user.save();      
    } catch (error) {
      
      if (error.code === '23505') {
        //duplicate username
        throw new ConflictException(`Username ${username} already exists`);
      } else {
        throw new InternalServerErrorException();
      }
    }

    delete newUser.password;
    delete newUser.salt;

    return newUser;
  }

  public async validateUserPassword(authCredentialsDto: AuthCredentialsDto): Promise<{id: number, username: string, displayname: string}> {
    const { username, password } = authCredentialsDto;
    const user = await this.findOne({where:{username: username}});
    

    if(user && await user.validatePassword(password)){      
      return {id: user.id, username: user.username, displayname: user.displayname};
    }else{
      return null;
    }
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
