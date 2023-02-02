import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pictures-dialog',
  templateUrl: './pictures-dialog.component.html',
  styleUrls: ['./pictures-dialog.component.css']
})
export class PicturesDialogComponent implements OnInit {
  no!: number;
  selectedPictures: string[] = [];
  selectPictures: string[] = [];
  pictures: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<PicturesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.no = this.data.no;
    for (let i = 0; i < this.data.items.length; i++) {
      if (this.no) {
        if (this.data.items[i].no == this.no) {
          this.selectPictures.push(...this.data.items[i].numberOfPics);
        } else {
          this.selectedPictures.push(...this.data.items[i].numberOfPics);
        }
      } else {
        this.selectedPictures.push(...this.data.items[i].numberOfPics);
      }
    }
    this.setPictures();
  }

  onPicture(picture: any) {
    switch (picture.class) {
      case "selected":
        return;
        break;

      case "no-selected":
        picture.class = "select";
        return;
        break;

      case "select":
        picture.class = "no-selected";
        return;
        break;

      default:
        break;
    }
  }

  async setPictures() {
    for (let i = 0; i < this.data.pictures.length; i++) {
      let picture: {class: string, name: string, src: string | ArrayBuffer | null} = {
        class: "no-selected",
        name: this.data.pictures[i].name,
        src: this.data.pictures[i].src
      };

      if (this.selectPictures.includes(this.data.pictures[i].name)) {
        picture.class = "select";
      } else if (this.selectedPictures.includes(this.data.pictures[i].name)) {
        picture.class = "selected";
      }
      
      this.pictures.push(picture);
    }
  }

  onOk() {
    let toSend = []
    for (let i = 0; i < this.pictures.length; i++) {
      if(this.pictures[i].class == 'select') {
        toSend.push(this.pictures[i].name);
      };
    }
    this.dialogRef.close(toSend);
  }
}
