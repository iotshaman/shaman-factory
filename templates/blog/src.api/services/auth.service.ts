import 'reflect-metadata';
import * as _bcrypt from 'bcryptjs';
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

  private getAccessToken = (user: User): string => {
    let token = {
      email: user.email,
      name: user.name
    }
    return sign(token, this.config.jwtSecret);
  }

}