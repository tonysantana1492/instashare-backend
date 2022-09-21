import { User } from 'src/auth/user.entity';
import { File } from '../filemanager.entity';

export class FilemanagerServiceMock {
  async getAll(): Promise<File[]> {
    const file = new File();
    return Promise.resolve([file]);
  }

  async updateName(id: number, name: string): Promise<File[]> {
    const file = new File();
    return Promise.resolve([file]);
  }

  async uploadFile(
    filebinary: Express.Multer.File,
    user: User,
  ): Promise<File[]> {
    const file = new File();
    return Promise.resolve([file]);
  }

  async downloadFile(id: number) {
    const mockFile = {
      fieldname: 'file',
      originalname: 'TradeHistory.csv',
      encoding: '7bit',
      mimetype: 'text/csv',
      buffer: Buffer.from(__dirname + '/../../example.csv', 'utf8'),
      size: 51828,
    } as Express.Multer.File;
    
    return Promise.resolve(mockFile);
  }
}
