import * as _moment from 'moment';
import { Request, Response } from "express";
import { injectable } from "inversify";
import { IAuthService } from "../services/auth.service";
import { IoC, TYPES } from "../composition/app.composition";
import { RouteError } from "../models/route-error";

@injectable()
export class ControllerBase {

  protected authService: IAuthService;

  constructor() {
    this.authService = IoC.get<IAuthService>(TYPES.AuthService);
  }

  protected authorize = (req: Request, _res: Response, next: any): void => {
    let token: string = req.get('Authorization');
    if (!token) return this.notAuthorized("Auth token not provided", next);
    if (token.substring(0, 6) != "Bearer") 
      return this.notAuthorized("Invalid authorization type", next);
    try {
      token = token.substring(7);
      let accessToken = this.authService.verifyToken(token);
      if (_moment().utc().isAfter(_moment(accessToken.expires))) {
        return next(new RouteError("Access token expired", 403));
      }
      req['_token'] = accessToken;
    } catch(_ex) {
      return this.notAuthorized("Invalid token", next);
    }
    next();
  }

  private notAuthorized = (msg: string, next: any) => {
    next(new RouteError(msg, 401))
  }

}