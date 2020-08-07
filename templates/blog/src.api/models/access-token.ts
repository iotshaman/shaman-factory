export class AccessToken {
  
  email: string;
  name: string;

  constructor(obj: any = null) {
    if (obj) Object.assign(this, obj);
  }

}