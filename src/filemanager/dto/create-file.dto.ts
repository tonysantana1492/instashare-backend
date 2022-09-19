import { IsNotEmpty } from "class-validator";

export class CreateFileDto {

    @IsNotEmpty()
    url: string;
    
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    ext: string;
  
    @IsNotEmpty()
    type: string;
  
    @IsNotEmpty()
    size: number;    
}

export class SampleDto {
    name: string;
  }