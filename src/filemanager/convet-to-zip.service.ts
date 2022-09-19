import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { File } from "./filemanager.entity";
import { FilemanagerRepository } from "./filemanager.repository";
import * as AdmZip from 'adm-zip';
import { unlink } from "fs/promises";

@Injectable()
export class ConvertToStringService {
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
    
        // add file directly
    // var content = "inner content of the file";
    // zip.addFile("test.txt", Buffer.from(content, "utf8"), "entry comment goes here");
    // add local file
    // get everything as a buffer
    // var willSendthis = zip.toBuffer();
    // or write everything to disk

    
    /*const response = {
      originalname: file.originalname,
      filename: file.filename,
    };
    /*var AdmZip = require('adm-zip');
    var zip = new AdmZip(file.buffer);

    var zipEntries = zip.getEntries();
    console.log(zipEntries.length);*/
       
    }
}