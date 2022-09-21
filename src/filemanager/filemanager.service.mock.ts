import { File } from './filemanager.entity';

export class FilemanagerServiceMock {
  async getAll(): Promise<File[]> {
    const file = new File();
    return Promise.resolve([file]);
  }

  async updateName(id: number, name: string): Promise<File[]> {
    const file = new File();
    return Promise.resolve([file]);
  }
}
