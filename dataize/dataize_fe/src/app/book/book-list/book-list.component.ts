import { Component, Input, OnInit} from '@angular/core';
import { Subject } from 'rxjs';
import { CrudService } from 'src/app/shared/services/crud.service';
import { BookDataService } from '../services/book-data.service';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.css']
})
export class BookListComponent implements OnInit {
  @Input() target!: HTMLElement;
  @Input() fileData: any;
  @Input() pictures: any[] = [];
  updateFileData = new Subject();

  constructor(
    private bookDataService: BookDataService,
    private crudService: CrudService,
  ) { }

  ngOnInit(): void {
    this.crudService.bookListSubject.subscribe((pictures: any | any[]) => {
      let picsArr = pictures;
      console.log(pictures);
      
      let selected = {}
      
      for (let i = 0; i < this.fileData.data.length; i++) {
        if(this.fileData.data[i].numberOfPics[0]) {
          let key = this.fileData.data[i].numberOfPics[0] as string;
          selected = {...selected, [key]: i}
        }
      }

      for (let j = 0; j < picsArr.length; j++) {
        let key = picsArr[j].name as keyof typeof selected;
        if(key in selected) {
          this.fileData.data[selected[key]] = {...this.fileData.data[selected[key]], src: picsArr[j].src} 
        };
      }
      this.updateFileData.next(this.fileData)
    });
    this.updateFileData.subscribe((fileData) => {
      this.fileData = fileData
      console.log(fileData);
      
    });
  }

  onClick(i: number) {
    this.bookDataService.bookDataSubject.next(this.fileData.data[i]);
    this.target.scrollIntoView();
  }

  onDelete(i: number) {
    this.crudService.deleteItem('book', this.fileData.fileName, i).then(() => 
      this.crudService.bookFileSubject.next(this.fileData.fileName)
    );
  }
}
