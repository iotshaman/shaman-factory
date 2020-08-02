import 'reflect-metadata';
import * as _bcrypt from 'bcryptjs';
import { injectable } from "inversify";
import { verify, sign } from 'jsonwebtoken';
import { IoC, TYPES } from '../composition/app.composition';
import { IAppConfig } from '../models/app.config';
import { WebsiteContext } from '../models/website.context';
import { User } from '../models/user';

export interface IAuthService {
  login: (email: string, password: string) => Promise<string>;
  addUser: (email: string, password: string) => Promise<void>;
  verifyToken: (accessToken: string) => boolean;
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

  addUser = (email: string, password: string): Promise<void> => {
    let newUser = new User();
    newUser.email = email;
    newUser.passwordHash = _bcrypt.hashSync(password, _bcrypt.genSaltSync(8), null);
    this.context.models.users.add(email, newUser);
    return this.context.saveChanges();
  }

  verifyToken = (accessToken: string): boolean => {
    verify(accessToken, this.config.jwtSecret);
    return true;
  }

  private getAccessToken = (user: User): string => {
    let token = {
      email: user.email
    }
    return sign(token, this.config.jwtSecret);
  }

}