import { Request, Response, Application, Router } from "express";
import { injectable } from 'inversify';

@injectable()
export class HealthCheckController {

  private router: Router;

  constructor(private app: Application) {
    this.configure();              
  }

  private configure = () => {
    this.router = Router();
    this.router
      .get('/', this.getStatus)

    this.app.use('/api/health', this.router);
  }

  getStatus = (_req: Request, res: Response, _next: any) => {
    res.json({status: 'healthy'});
  }

}