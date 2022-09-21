import { User } from 'src/auth/user.entity';
import { CreateFileDto } from '../dto/create-file.dto';
import { File } from '../filemanager.entity';

export class FilemanagerRepositoryMock {

  file: File = new File(); 

  async find(): Promise<[File]> {    
    return Promise.resolve([this.file]);
  }

  findOne(id: number): Promise<File> {
    /*const file: File = new File();
    const user = new User();
    file.id = 8;
    file.name = 'dfdf';
    file.ext = 'dfdf';
    file.type = 'fdfd';
    file.size = 23;
    file.url = 'dfdfdfd';
    file.user = user;*/

    return Promise.resolve(this.file);
  }

  async uploadFile(createFileDto: CreateFileDto, user: User): Promise<File> {
    
    return Promise.resolve(this.file);
  }

  async updateName(filebinary: File, name: string): Promise<File> {
    
    return Promise.resolve(this.file);
  }

  async allowDownloadFile(file: File, urlZip: string): Promise<void> {}
}
