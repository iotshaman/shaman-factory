import * as _moment from 'moment';

export class Blog {

  filename: string;
  name: string;
  title: string;
  description: string;
  author: string;
  text: string;
  html: string;
  date: string;
  displayDate: string;
  image: string;
  published: boolean;

  constructor(obj: Blog = null) {
    if (obj) Object.assign(this, obj);
    this.setDisplayDate(this.date);
  }

  setDisplayDate(date: string): void {
    if (!date) return;
    this.displayDate = _moment(date).format('MMMM Do YYYY');
  }

}