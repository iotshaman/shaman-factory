import 'reflect-metadata';
import * as _bcrypt from 'bcryptjs';
import * as _moment from 'moment';
import { injectable } from "inversify";
import { verify, sign } from 'jsonwebtoken';
import { IoC, TYPES } from '../composition/app.composition';
import { IAppConfig } from '../models/app.config';
import { WebsiteContext } from '../models/website.context';
import { User } from '../models/user';
import { AccessToken } from '../models/access-token';

export interface IAuthService {
  login: (email: string, password: string) => Promise<string>;
  verifyToken: (accessToken: string) => AccessToken;
  getAccessToken: (user: User) => string;
  changePassword: (email: string, oldPassword: string, newPassword: string) => Promise<User>;
}

@injectable()
export class AuthService implements IAuthService {

  private config: IAppConfig;
  private context: WebsiteContext;

  constructor() {
    this.config = IoC.get<IAppConfig>(TYPES.AppConfig);
    this.context = IoC.get<WebsiteContext>(TYPES.WebsiteContext);
  }
  
  login = (email: string, password: string): Promise<string> => {
    return new Promise((res, err) => {
      let user = this.context.models.users.find(email);
      if (!user) return err(new Error(`Invalid email address '${email}'.`));
      let match = _bcrypt.compareSync(password, user.passwordHash);
      if (!match) return err(new Error("Password is invalid."));
      res(this.getAccessToken(user));
    });
  }

  verifyToken = (accessToken: string): AccessToken => {
    let token = verify(accessToken, this.config.jwtSecret);
    return new AccessToken(token);
  }

  getAccessToken = (user: User): string => {
    let expires = _moment().utc().add(1, 'minute');
    if (!user.temporaryPass) expires.add(2, 'day');
    let tokenData = {
      email: user.email,
      name: user.name,
      expires: expires.toDate()
    }
    return sign(tokenData, this.config.jwtSecret);
  }

  changePassword = (email: string, oldPassword: string, newPassword: string): Promise<User> => {
    return new Promise((res, err) => {
      let user = this.context.models.users.find(email);
      let match = _bcrypt.compareSync(oldPassword, user.passwordHash);
      if (!match) return err(new Error("Invalid password"));
      user.passwordHash = _bcrypt.hashSync(newPassword, _bcrypt.genSaltSync(8), null);
      user.temporaryPass = false;
      this.context.saveChanges().then(_ => res(user)).catch(ex => err(ex));
    })
  }

}