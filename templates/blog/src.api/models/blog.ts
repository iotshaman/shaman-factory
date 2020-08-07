import * as _moment from 'moment';

export class Blog {

  filename: string;
  name: string;
  title: string;
  description: string;
  author: string;
  text: string;
  html: string;
  image: string;
  published: boolean;
  tags: string;
  createdDate: string;
  modifiedDate: string;
  displayDate: string;

  constructor(obj: any = null) {
    if (obj) Object.assign(this, obj);
    if (!this.description) this.description = '';
    if (!this.author) this.author = 'N/A';
    if (!this.text) this.text = '';
    if (!this.html) this.html = '';
    if (!this.image) this.image = '/images/shaman-factory.png';
    if (!this.published) this.published = false;
    if (!this.tags) this.tags = '';
    this.setCreatedDate(this.createdDate);
    this.setModifiedDate(this.modifiedDate);
  }

  setCreatedDate(date: string): void {
    if (date) this.createdDate = date;
    else this.createdDate = (new Date()).toISOString();
    this.displayDate = _moment(date).format('MMMM Do YYYY');
  }

  setModifiedDate(date: string): void {
    this.modifiedDate = date;
    if (!date) return;
    this.displayDate = _moment(date).format('MMMM Do YYYY');
  }

}