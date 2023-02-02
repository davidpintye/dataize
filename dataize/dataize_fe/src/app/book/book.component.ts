import { AfterViewInit, Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CrudService } from '../shared/services/crud.service';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  bookDisplayedColumns: string[] = ['publish_date', 'title', 'subtitle', 'authors', 'publishers', 'language', 'isbn_10', 'isbn_13', 'form'];
  fileData!: any;
  fileName: string = "";
  pictures: any[] = [];
  isComponent = false;
  
  constructor(private crudService: CrudService, private sanitizer: DomSanitizer) { }

  async ngOnInit(): Promise<void> {
    this.crudService.bookFileSubject
      .subscribe((fileName: any) => {
        this.crudService.openFile('book', fileName)
        // .then(() => this.isComponent = false)
        .then((fileData) => {
          this.fileData = fileData;          
        }).then(() => {
          this.crudService.bookListSubject.next(this.pictures);
          this.isComponent = true;
        })});
    this.crudService.getFileInfo('book')
      .then((info: any) => {
        this.fileName = info.fileName;
        this.crudService.bookFileSubject.next(this.fileName);
      });
  }

  onPicsUpload(pictures: any[]) {
    this.pictures = pictures;
    this.crudService.bookListSubject.next(pictures);
  }
}
