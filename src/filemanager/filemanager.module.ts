import { Module } from '@nestjs/common';
import { FilemanagerService } from './filemanager.service';
import { FilemanagerController } from './filemanager.controller';
import { AuthModule } from 'src/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilemanagerRepository } from './filemanager.repository';
import { ConvertToZipService } from './convet-to-zip.service';

@Module({
  imports:[AuthModule,TypeOrmModule.forFeature([FilemanagerRepository])],
  controllers: [FilemanagerController],
  providers: [FilemanagerService, FilemanagerRepository, ConvertToZipService],
})
export class FilemanagerModule {}
