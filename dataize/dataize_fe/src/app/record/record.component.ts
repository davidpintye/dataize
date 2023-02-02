import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CrudService } from '../shared/services/crud.service';

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {
  recordDisplayedColumns: string[] = ['year', 'title', 'artist', 'release_title', 'label', 'genre', 'format', 'country', 'barcode', 'form'];
  fileData!: any;
  fileName!: string;
  pictures: any[] = [];
  isComponent = false;

  constructor(private crudService: CrudService, private sanitizer: DomSanitizer) { }

  async ngOnInit(): Promise<void> {
    this.crudService.recordFileSubject
      .subscribe((fileName: any) => {
        this.crudService.openFile('record', fileName)
          // .then(() => this.isComponent = false)
          .then((fileData) => {
            this.fileData = fileData;
          }).then(() => {
            this.isComponent = true;
          })
      });
    this.crudService.getFileInfo('record')
      .then((info: any) => {
        this.fileName = info.fileName;
        this.crudService.recordFileSubject.next(this.fileName);
      });
  }

  onPicsUpload(pictures: any[]) {
    this.pictures = pictures;
  }
}
