import { Request, Response, Application, Router } from "express";
import { injectable } from "inversify";
import { IAuthService } from "../services/auth.service";
import { IoC, TYPES } from "../composition/app.composition";
import { RouteError } from "../models/route-error";

@injectable()
export class ControllerBase {

  private authService: IAuthService;

  constructor() {
    this.authService = IoC.get<IAuthService>(TYPES.AuthService);
  }

  protected authorize = (req: Request, res: Response, next: any): void => {
    let token: string = <string>req.headers['authorization'];
    if (!token) return this.notAuthorized("Auth token not provided", res);
    if (!this.authService.verifyToken(token)) return this.notAuthorized("Invalid token", res);
    next();
  }

  private notAuthorized = (msg: string, res: Response) => {
    res.status(401).send(msg);
  }

}