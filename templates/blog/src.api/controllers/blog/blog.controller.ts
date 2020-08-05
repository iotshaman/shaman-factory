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
      .get('/:filename', this.getBlog)
      .put('/', this.addBlog)
      .post('/', this.updateBlog)
      .delete('/:filename', this.deleteBlog)

    this.app.use('/api/blog', this.router);
  }

  getAllBlogs = (_req: Request, res: Response, next: any) => {
    this.blogService.getAllBlogs()
      .then(blogs => res.json(blogs))
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

  getBlog = (req: Request, res: Response, next: any) => {
    this.blogService.getBlog(req.params['filename'])
      .then(blog => res.json(blog))
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

  addBlog = (req: Request, res: Response, next: any) => {
    this.blogService.addBlog(req.body.title)
      .then(blog => res.json(blog))
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

  updateBlog = (req: Request, res: Response, next: any) => {
    this.blogService.updateBlog(req.body)
      .then(blog => res.json(blog))
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

  deleteBlog = (req: Request, res: Response, next: any) => {
    this.blogService.deleteBlog(req.params['filename'])
      .then(_ => res.status(204).send())
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

}