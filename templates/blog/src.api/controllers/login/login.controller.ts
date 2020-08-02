import { Request, Response, Application, Router } from "express";
import { injectable } from 'inversify';
import { IoC, TYPES } from "../../composition/app.composition";
import { RouteError } from "../../models/route-error";
import { IAuthService } from "../../services/auth.service";

@injectable()
export class LoginController {

  private router: Router;
  private authService: IAuthService;

  constructor(private app: Application) {
    this.configure();
    this.authService = IoC.get<IAuthService>(TYPES.AuthService);
  }

  private configure = () => {
    this.router = Router();
    this.router
      .post('/', this.login)

    this.app.use('/api/login', this.router);
  }

  login = (req: Request, res: Response, next: any) => {
    let {email, password} = req.body;
    this.authService.login(email, password)
      .then(accessToken => res.json({accessToken}))
      .catch((ex: Error) => next(new RouteError(ex.message, 401)));
  }

}