import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { File } from "./filemanager.entity";
import { FilemanagerRepository } from "./filemanager.repository";
import * as AdmZip from 'adm-zip';
import { unlink } from "fs/promises";

@Injectable()
export class ConvertToZipService {
    constructor(
        private fileManagerRepository: FilemanagerRepository
      ) {}

    @OnEvent('upload.file')
    async listentUploadEvent(file: File){
        var zip = new AdmZip();   
        zip.addLocalFile(file.url);

        const urlZip = `${file.url}.zip`;
        await zip.writeZipPromise(urlZip);
        await unlink(file.url);

        await this.fileManagerRepository.allowDownloadFile(file, urlZip);    
    }
}