import { Request, Response, Application, Router } from "express";
import { injectable } from 'inversify';
import { IoC, TYPES } from "../../composition/app.composition";
import { IUserService } from "../../services/user.service";
import { RouteError } from "../../models/route-error";
import { ControllerBase } from "../controller.base";

@injectable()
export class UserController extends ControllerBase {

  private router: Router;
  private userService: IUserService;

  constructor(private app: Application) {
    super();
    this.configure();
    this.userService = IoC.get<IUserService>(TYPES.UserService);
  }

  private configure = () => {
    this.router = Router();
    this.router
      .use(this.authorize)
      .get('/', this.getAllUsers)
      .get('/:email', this.getUser)
      .put('/', this.addUser)
      .delete('/:email', this.deleteUser)

    this.app.use('/api/user', this.router);
  }

  getAllUsers = (_req: Request, res: Response, next: any) => {
    this.userService.getAllUsers()
      .then(users => res.json(users))
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

  getUser = (req: Request, res: Response, next: any) => {
    this.userService.getUser(req.params['email'])
      .then(user => res.json(user))
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

  addUser = (req: Request, res: Response, next: any) => {
    let {email, name, password} = req.body;
    this.userService.addUser(email, name, password)
      .then(user => res.json(user))
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

  deleteUser = (req: Request, res: Response, next: any) => {
    this.userService.deleteUser(req.params['email'])
      .then(_ => res.status(204).send())
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

}