import { Application, Request, Response } from 'express';
import { IoC, TYPES } from "./composition/app.composition";
import { RouteError } from './models/route-error';
import { ILogger } from './logger';
import { HealthCheckController } from './controllers/health/health-check.controller';
import { LoginController } from './controllers/login/login.controller';
import { UserController } from './controllers/user/user.controller';
import { FormController } from './controllers/form/form.controller';

export class ApiRouter {

  private logger: ILogger;
  private controllers: any[] = [];

  constructor(private app: Application) {
    this.logger = IoC.get<ILogger>(TYPES.Logger);
    this.loadMiddleware();
    this.loadRoutes();
    this.loadErrorHandlers();
  }

  private loadMiddleware = () => {
    this.app.all('/api/*', this.logApiRequests);
  }

  private loadRoutes = () => {
    this.controllers.push(new HealthCheckController(this.app));
    this.controllers.push(new LoginController(this.app));
    this.controllers.push(new UserController(this.app));
    this.controllers.push(new FormController(this.app))
  }

  private loadErrorHandlers = () => {
    this.app.use(this.routeErrors);
  }

  private logApiRequests = (req: Request, res: Response, next: any) => {
    this.logger.log(`${req.method.toUpperCase()} - ${req.url}`);
    next();
  }

  private routeErrors = (err: RouteError, req: Request, res: Response, next: any) => {
    this.logger.log(`${req.method.toUpperCase()} - ${req.url} :: ${err.message}`, 'error');
    if (!err.statusCode) return next();
    if (!err.sendMessge) return res.status(err.statusCode).send('Server Error');
    return res.status(err.statusCode).send(err.message);
  }

}