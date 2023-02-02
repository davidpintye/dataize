import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ExcelService } from 'src/app/shared/services/excel.service';
import { RecordDataService } from '../services/record-data.service';
import { RecordFormService } from '../services/record-form.service';
import { genresList } from './genres';
import { countryList } from '../../shared/countryList';
import { PicturesDialogComponent } from 'src/app/shared/pictures-dialog/pictures-dialog.component';
import { CrudService } from 'src/app/shared/services/crud.service';

@Component({
  selector: 'app-record-form',
  templateUrl: './record-form.component.html',
  styleUrls: ['./record-form.component.css']
})
export class RecordFormComponent implements OnInit {

  recordForm = new FormGroup({});
  numOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  countryOptions: string[] = [...countryList];
  filteredCountryOptions!: Observable<string[]>;
  showTable = false;
  selectedItem: number = NaN;
  rawText!: string;
  formatHint!: string;
  countryHint!: string;
  speedHint!: string;
  genres = genresList;
  recordData = { numberOfPics: [], no: NaN, title: "" };
  items!: any;
  fileName!: string;
  @Input() fileData!: any;
  @Input() pictures: any = [];

  @ViewChild('genreInput') genreInput!: ElementRef<HTMLInputElement>;

  constructor(
    private recordDataService: RecordDataService,
    private recordFormService: RecordFormService,
    private crudService: CrudService,
    private excelService: ExcelService,
    public dialog: MatDialog,
  ) { }

  async ngOnInit() {
    this.recordForm = new FormGroup(this.recordFormService.setRecordForm());

    let countryControl = this.recordForm.get('country');
    this.filteredCountryOptions = countryControl!.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '', this.countryOptions))
    );

    this.recordDataService.cellDataSubject.subscribe((data: any) => {
      let key = Object.keys(data)[0];
      let value = Object.values(data)[0];
      this.recordForm.get(key)?.setValue(value);
    });

    this.recordDataService.recordDataSubject.subscribe((response: any) => {
      const record = response;
      this.formatHint = record.format_hint;
      this.countryHint = record.country;
      this.recordData = {
        no: record.no,
        numberOfPics: record.numberOfPics,
        title: record.title,
      }
      this.selectedItem = record.no;

      this.recordForm.get("price")?.setValue(record.price);
      this.recordForm.get("speed")?.setValue(record.speed);
      this.recordForm.get("format")?.setValue(record.format);
      this.recordForm.get("country")?.setValue(record.country);
      this.recordForm.get("genre")?.setValue(record.genre);
      this.recordForm.get("year")?.setValue(record.year);
      this.recordForm.get("artist")?.setValue(record.artist);
      this.recordForm.get("label")?.setValue(record.label);
      this.recordForm.get("release_title")?.setValue(record.release_title);
      this.recordForm.get("barcode")?.setValue(record.barcode);
      this.recordForm.get("conductor")?.setValue(record.conductor);
      this.recordForm.get("composer")?.setValue(record.composer);
      this.recordForm.get("comment")?.setValue(record.comment);
      this.recordData = { no: record.no, numberOfPics: record.numberOfPics, title: record.title }
    });
  }

  private _filter(value: string, options: string[]): string[] {
    const filterValue = value.toLowerCase();
    return options.filter(option => option.toLowerCase().includes(filterValue));
  }

  onRecordForm() {
    if (this.recordForm.get("genre")?.value instanceof Array) {
      this.recordForm.get("genre")?.setValue(this.recordForm.get("genre")?.value[0])
    }
    this.recordFormService.basePrice = this.recordForm.get("price")?.value;
    this.excelService.addRecord(this.recordForm, this.recordData, this.fileData.fileName).then(() => {
      window.scrollTo(0, 0);
      this.onClear();
      this.crudService.recordFileSubject.next(this.fileData.fileName);
    });
  }

  onSearchInTitle(value: string) {
    let keywords = "intitle:" + value;
    this.recordDataService.getRecord(keywords);
  }

  onSearchInAuthor(value: string) {
    let keywords = "inauthor:" + value;
    this.recordDataService.getRecord(keywords);
  }

  onClear() {
    this.recordFormService.clearForm(this.recordForm);
    this.recordData = {
      numberOfPics: [],
      no: NaN,
      title: ""
    };
    this.selectedItem = NaN;
  }

  onNumbOfPictures() {
    const dialRef = this.dialog.open(
      PicturesDialogComponent, { data: { no: this.recordData.no, selectPictures: [...this.recordData.numberOfPics], pictures: this.pictures, items: this.fileData.data } }
    );
    dialRef.afterClosed().subscribe(selectedPictures => this.recordData.numberOfPics = selectedPictures);
  }

  clearInput(formControllName: string, input: any) {
    this.recordForm.get(formControllName)?.setValue('');
    input.value = '';
    this.selectedItem = NaN;
  }
  
  download(fileName: string) {
    this.crudService.download('record', fileName);
  }
}