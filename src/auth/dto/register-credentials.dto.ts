import { IsNumber, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class RegisterCredentialsDto {  
  @IsString()
  @MinLength(4)
  @MaxLength(40) 
  displayname: string;

  @IsString()
  @MinLength(4)
  @MaxLength(40)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(20)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password too weak',
  })
  password: string;
}

export class RegisterCredentialsDtoOutput { 

  @IsNumber()
  id: number;
 
  @IsString()
  displayname: string;

  @IsString()
  username: string;
}
