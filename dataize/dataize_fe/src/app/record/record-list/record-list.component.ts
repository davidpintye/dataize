import { Component, Input, OnInit } from '@angular/core';
import { CrudService } from 'src/app/shared/services/crud.service';
import { RecordDataService } from '../services/record-data.service';

@Component({
  selector: 'app-record-list',
  templateUrl: './record-list.component.html',
  styleUrls: ['./record-list.component.css']
})
export class RecordListComponent implements OnInit{

  @Input() target!: HTMLElement;
  @Input() fileData: any;
  @Input() pictures: any = [];

  constructor(
    private recordDataService: RecordDataService,
    private crudService: CrudService,
  ) { }

  ngOnInit(): void {
    this.crudService.bookListSubject.subscribe((pictures: any | any[]) => {
      let picsArr = pictures;
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
    });
  }

  onClick(i: number) {
    this.recordDataService.recordDataSubject.next(this.fileData.data[i]);
    this.target.scrollIntoView();
  }

  onDelete(i: number) {
    this.crudService.deleteItem('record', this.fileData.fileName, i).then(() => 
      this.crudService.recordFileSubject.next(this.fileData.fileName)
    );
  }
}
