import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { RegisterCredentialsDto } from './dto/register-credentials.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService ){}

    @Post('/register')
    register(@Body(ValidationPipe) registerCredentialsDto: RegisterCredentialsDto): Promise<{token: string, user: object}>{
        return this.authService.register(registerCredentialsDto);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentialsDto: AuthCredentialsDto): Promise<{token: string, user: object}>{
        return this.authService.signIn(authCredentialsDto);
    }

    @Post('/access-token')
    accessToken( @Body('token') token: string): Promise<{token: string, user: object}>{
        return this.authService.accessToken(token);
    }

}

