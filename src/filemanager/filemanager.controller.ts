import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Logger,
  Param,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  Res,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { multerOptions } from 'src/config/multer.config';
import { CreateFileDto } from './dto/create-file.dto';
import { FilemanagerService } from './filemanager.service';
import path, { join } from 'path';
import { createReadStream, readFileSync } from 'fs';
import { Response } from 'express';

@Controller('filemanager')
@UseGuards(AuthGuard())
export class FilemanagerController {
  private logger = new Logger('FileManager');
  constructor(private filemanagerService: FilemanagerService) {}

  @Get()
  async getAll(@GetUser() user: User) {
    this.logger.verbose(`Get all Files`);
    return this.filemanagerService.getAll();
  }

  @Get('/download/:id')
  async downloadById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Res() response: Response,
  ) {

    response.contentType('image/png');
    response.attachment();
    const fileToDownload = await this.filemanagerService.downloadFile(id);        

    return response.send(fileToDownload);
  }

  @Patch('/:id/name')
  async updateName(
    @Param('id', ParseIntPipe) id: number,
    @Body('name') name: string,
  ) {
    return this.filemanagerService.updateName(id, name);
  }

  @Post('/upload')
  @UseInterceptors(FileInterceptor('file', multerOptions))
  async uploadfile(
    @UploadedFile() file: Express.Multer.File,
    @GetUser() user: User,
  ) {

    return this.filemanagerService.uploadFile(file, user);
  }

}
