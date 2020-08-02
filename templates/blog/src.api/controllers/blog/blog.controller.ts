import { Request, Response, Application, Router } from "express";
import { injectable } from 'inversify';
import { IoC, TYPES } from "../../composition/app.composition";
import { IBlogService } from "../../services/blog.service";
import { RouteError } from "../../models/route-error";
import { ControllerBase } from "../controller.base";

@injectable()
export class BlogController extends ControllerBase {

  private router: Router;
  private blogService: IBlogService;

  constructor(private app: Application) {
    super();
    this.configure();
    this.blogService = IoC.get<IBlogService>(TYPES.BlogService);
  }

  private configure = () => {
    this.router = Router();
    this.router
      .get('/', this.getAllBlogs)

    this.app.use('/api/blog', this.router);
  }

  getAllBlogs = (_req: Request, res: Response, next: any) => {
    this.blogService.getAllBlogs()
      .then(blogs => res.json(blogs))
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

}