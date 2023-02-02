import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateDialogComponent } from '../create-dialog/create-dialog.component';
import { FilesDialogComponent } from '../files-dialog/files-dialog.component';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(
    private crudService: CrudService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
  ) { }

  createFileDialog(item: string) {
    const dialRef = this.dialog.open(CreateDialogComponent);
    dialRef.afterClosed().subscribe(data => {
      this.crudService.createFile(item, data.fileName).then(() => {
        this.crudService.openFile(item, data.file);
      }).then(() => {
          if (item === "book") this.crudService.bookFileSubject.next(data.file);
          if (item === "record") this.crudService.recordFileSubject.next(data.file);
      }).then(() => this.resetPage(item));
    });
  }

  openFileDialog(item: string) {
    this.crudService.getFileNames(item).then((data: string[] | any) => {
      for (let i = 0; i < data.length; i++) {
        data[i] = data[i].split('.json')[0];
      }
      return data;
    }).then(fileNames => {
      const dialRef = this.dialog.open(FilesDialogComponent, { data: fileNames });
      dialRef.afterClosed().subscribe(
        (data: { file: string, action: string }) => {
          if (data.file && data.action === "open") {
            this.crudService.openFile(item, data.file)
            if (item === "book") this.crudService.bookFileSubject.next(data.file);
            if (item === "record") this.crudService.recordFileSubject.next(data.file);
            this.resetPage(item);
          } else if (data.file && data.action === 'delete') {
            this.crudService.deleteFile(item, data.file);
            this.resetPage(item);
          } else if (data.file && data.action === 'downloadXlsx') {
            this.download(item, data.file);
          }
        });
    });
  }

  download(item: string, fileName: string) {
    this.crudService.download(item, fileName);
  }

  resetPage(item: string) {
    console.log(item);
    this.router.navigateByUrl('/',{skipLocationChange:true}).then(()=>{
      this.router.navigate(['/'+item+'s']);
    })
  }
}
