export class AccessToken {
  
  email: string;
  name: string;
  expires: Date;

  constructor(obj: any = null) {
    if (obj) Object.assign(this, obj);
  }

}