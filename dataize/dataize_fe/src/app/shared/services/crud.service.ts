import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  bookFileSubject = new Subject();
  recordFileSubject = new Subject();
  bookFileNameSubject = new Subject();
  bookFileNamesSubject = new Subject();
  recordFileNameSubject = new Subject();
  recordFileNamesSubject = new Subject();
  bookListSubject = new Subject();
  recordListSubject = new Subject();
  headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8' });
  price!: number;

  constructor(
    private http: HttpClient,
    private matSnackBar: MatSnackBar

  ) { }

  async createFile(item: string, fileName: string | null) {
    return await this.postToServer('createfile', item, { fileName: fileName }).toPromise();
  }

  async openFile(itemType: string, fileName: string) {
    return await this.postToServer('openfile', itemType, { fileName: fileName }).toPromise().then((res: any) => {
      if (res.data) {
        res.data = JSON.parse(res.data)
        for (let i = 0; i < res.data.length; i++) {
          res.data[i] = { no: i + 1, ...res.data[i] };
        }
      }
      return res;
    });
  }

  async writeItem(itemType: string, line: any, fileName: string) {
    await this.postToServer('writeline', itemType, { line: line, fileName: fileName }).toPromise()
    .then((data) => console.log(data));
  }

  async deleteItem(itemType: string, fileName: string, index: number) {
    await this.postToServer('deleteitem', itemType, { fileName: fileName, index: index }).toPromise()
    .then( resolve => console.log("Item deleted!"));
  }

  async deleteFile(itemType: string, fileName: string) {
    await this.postToServer('deletefile', itemType, { fileName: fileName }).toPromise()
    .then( resolve => console.log("File deleted"));
  }

  postToServer(url: string, item: string, data: Object) {
    return this.http.post(environment.nodeServer + url, { ...data, item: item }, { headers: this.headers });
  }

  async getFileInfo(item: string) {
    const params = new HttpParams().set('item', item);
    const fileInfo = await this.http.get(environment.nodeServer + 'getfileinfo', { params: params }).toPromise();
    return fileInfo;
  }

  async getFileNames(path: string) {
    let params = new HttpParams().set('path', path);
    return await this.http.get(environment.nodeServer + 'getfilenames', { params: params }).toPromise();
  }

  getMatSnackBar(message: string) {
    this.matSnackBar.open(message, 'OK', {
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  download(item: string, fileName: string) {
    this.http.post(environment.nodeServer + 'downloadxlsx', { fileName: fileName, item: item }, { headers: this.headers, responseType: "blob" })
      .subscribe((data: Blob) => {
        let downLoadUrl = window.URL.createObjectURL(data);
        console.log(downLoadUrl);
        let a = document.createElement('a');
        document.body.appendChild(a);
        a.setAttribute('style', 'display: none');
        a.href = downLoadUrl;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(downLoadUrl);
        a.remove();
      });
  }
}
