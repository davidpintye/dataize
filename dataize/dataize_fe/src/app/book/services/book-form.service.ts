import { Injectable } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BookFormService {
  basePrice = 4.99;
  publish_date = new FormControl('');
  price = new FormControl(this.basePrice);
  country = new FormControl('United States');
  condition = new FormControl('Very Good');
  title = new FormControl('');
  subtitle = new FormControl('');
  authors = new FormControl('');
  publishers = new FormControl('');
  language = new FormControl('English');
  isbn_10 = new FormControl('');
  format = new FormControl('Paperback');
  features = new FormControl('');
  edition = new FormControl('');
  inscribed = new FormControl('');
  signed = new FormControl('');
  comment = new FormControl('');

  constructor() {}

  setBookForm() {
    let bookForm = {
      publish_date: this.publish_date,
      price: this.price,
      country: this.country,
      condition: this.condition,
      title: this.title,
      subtitle: this.subtitle,
      authors: this.authors,
      publishers: this.publishers,
      language: this.language,
      isbn_10: this.isbn_10,
      format: this.format,
      features: this.features,
      edition: this.edition,
      inscribed: this.inscribed,
      signed: this.signed,
      comment: this.comment
    };
    return bookForm
  }

  clearForm(form: FormGroup) {
    form.get('publish_date')?.setValue('');
    form.get('price')?.setValue(this.basePrice);
    form.get('country')?.setValue('United States');
    form.get('condition')?.setValue('Very Good');
    form.get('title')?.setValue('');
    form.get('subtitle')?.setValue('');
    form.get('authors')?.setValue('');
    form.get('publishers')?.setValue('');
    form.get('language')?.setValue('English');
    form.get('isbn_10')?.setValue('');
    form.get('format')?.setValue('Paperback');
    form.get('features')?.setValue('');
    form.get('edition')?.setValue('');
    form.get('inscribed')?.setValue('');
    form.get('signed')?.setValue('');
    form.get('comment')?.setValue('');
  }
}
