import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { CrudService } from '../services/crud.service';
import { DialogService } from '../services/dialog.service';

@Component({
  selector: 'app-file-info',
  templateUrl: './file-info.component.html',
  styleUrls: ['./file-info.component.css']
})
export class FileInfoComponent implements OnInit {
  @Input() fileData!: any;
  @Input() item!: string;
  @Output() picsUpload: EventEmitter<any[]> = new EventEmitter();

  constructor(
    private sanitizer: DomSanitizer, 
    private dialogService: DialogService, 
    private crudService: CrudService) { }

  ngOnInit(): void {
    
  }

  onUpload(event: any) {
    let pictures: any[] = [];
    const files = event.target.files;
    if (files.length === 0)
      return;

    for (let i = 0; i < files.length; i++) {
      let src = URL.createObjectURL(files[i]);
      let picture: any = {
        name: files[i].name,
        src: this.sanitizer.bypassSecurityTrustUrl(src)
      }
      pictures.push(picture);
    }

    this.picsUpload.emit(pictures);
    this.crudService.bookListSubject.next(pictures);
    
  }

  onCreateFileDialog() {
    this.dialogService.createFileDialog(this.item);
  }

  onOpenFileDialog() {
    this.dialogService.openFileDialog(this.item);
  }
}
