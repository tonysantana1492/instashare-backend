import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { readFileSync } from 'fs';
import { join } from 'path';
import { User } from 'src/auth/user.entity';
import { CreateFileDto } from './dto/create-file.dto';
import { File } from './filemanager.entity';
import { FilemanagerRepository } from './filemanager.repository';

@Injectable()
export class FilemanagerService {
  constructor(
    private fileManagerRepository: FilemanagerRepository,
    private eventEmiter: EventEmitter2,
  ) {}

  private logger = new Logger('FileManagerService');

  async getAll(): Promise<File[]> {

    return await this.fileManagerRepository.find();
  }

  async uploadFile(file: Express.Multer.File, user: User): Promise<File[]> {

    const originalname = file.originalname;
    const name = originalname.substring(0, originalname.lastIndexOf('.'));
    const ext = originalname.substring(originalname.lastIndexOf('.') + 1)
        
    const createFileDto: CreateFileDto = {
      name,
      ext,
      type: file.mimetype,
      size: file.size,
      url: file.path,
    };

    try {
      const newFile = await this.fileManagerRepository.uploadFile(
        createFileDto,
        user,
      );
      this.eventEmiter.emit('upload.file', newFile);
    } catch (error) {
      this.logger.error(
        `Failed to upload ${createFileDto.name} for user "${user.username}"`,
        error.stack,
      );
      throw new InternalServerErrorException();
    }

    const allFile = await this.getAll();
    // delete file.user; //No deseo q los detalles del usuario salgan en la respuesta

    return allFile;
  }

  async getFileById(id: number) {
    const found = await this.fileManagerRepository.findOne({
      where: { id: id },
    });

    if (!found) {
      throw new NotFoundException(`File with ID ${found.id} not exist`);
    }

    return found;
  }

  async downloadFile(id: number) {

    const file = await this.getFileById(id);

    if(!file){
      throw new NotFoundException(`File not exist in our DataBase`);
    }

    let downloadFile;

    try{
      downloadFile = readFileSync(join(process.cwd(), file.url));
    }catch(e){
      throw new NotFoundException('The File not exist in our sistem folder');
    }

    return downloadFile;
   
  }

  async updateName(id: number, name: string): Promise<File[]> {
    const file = await this.getFileById(id);
    const updatedFile = await this.fileManagerRepository.updateName(file, name);
    const allFiles = await this.getAll();
    return allFiles;
  }
}
