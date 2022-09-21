import { Injectable } from '@nestjs/common';
import { User } from 'src/auth/user.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateFileDto } from './dto/create-file.dto';
import { File } from './filemanager.entity';

@Injectable()
export class FilemanagerRepository extends Repository<File> {
  constructor(private dataSource: DataSource) {
    super(File, dataSource.createEntityManager());
  }

  async uploadFile(createFileDto: CreateFileDto, user: User): Promise<File> {
    const { name, ext, size, type, url } = createFileDto;

    const file = new File();
    file.name = name;
    file.ext = ext;
    file.type = type;
    file.size = size;
    file.url = url;
    file.user = user;

    return file.save();
  }

  async updateName(file: File, name: string): Promise<File> {
    file.name = name;
    return file.save();
  }

  async allowDownloadFile(file: File, urlZip: string): Promise<void> {
    file.status = true;
    file.url = urlZip;
    await file.save();
  }
  
}
