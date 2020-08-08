import { Request, Response, Application, Router } from "express";
import { injectable } from 'inversify';
import { RouteError } from "../../models/route-error";
import { ControllerBase } from "../controller.base";

@injectable()
export class LoginController extends ControllerBase {

  private router: Router;

  constructor(private app: Application) {
    super();
    this.configure();
  }

  private configure = () => {
    this.router = Router();
    this.router
      .post('/', this.login)
      .post('/:email/pwd', this.changePassword)

    this.app.use('/api/login', this.router);
  }

  login = (req: Request, res: Response, next: any) => {
    let {email, password} = req.body;
    this.authService.login(email, password)
      .then(accessToken => res.json({accessToken}))
      .catch((ex: Error) => next(new RouteError(ex.message, 401)));
  }

  changePassword = (req: Request, res: Response, next: any) => {
    let email = req.params['email'];
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    this.authService.changePassword(email, oldPassword, newPassword)
      .then(this.authService.getAccessToken)
      .then(accessToken => res.json({accessToken}))
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

}