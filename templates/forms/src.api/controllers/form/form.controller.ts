import { Request, Response, Application, Router } from "express";
import { injectable } from 'inversify';
import { IoC, TYPES } from "../../composition/app.composition";
import { ControllerBase } from "../controller.base";
import { IFormService } from "../../services/form.service";
import { RouteError } from "../../models/route-error";

@injectable()
export class FormController extends ControllerBase {

  private router: Router;
  private formService: IFormService;

  constructor(private app: Application) {
    super();
    this.configure();
    this.formService = IoC.get<IFormService>(TYPES.FormService);
  }

  private configure = () => {
    this.router = Router();
    this.router
      .use(this.authorize)
      .get('/', this.getAllForms)
      .get('/:name', this.getForm)
      .put('/', this.addForm)
      .post('/', this.updateForm)
      .delete('/:name', this.deleteForm)

    this.app.use('/api/form', this.router);
  }

  getAllForms = (_req: Request, res: Response, next: any) => {
    this.formService.getAllForms()
      .then(forms => res.json(forms))
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

  getForm = (req: Request, res: Response, next: any) => {
    this.formService.getForm(req.params['name'])
      .then(form => res.json(form))
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

  addForm = (req: Request, res: Response, next: any) => {
    let {uuid, name, description} = req.body;
    this.formService.addForm(uuid, name, description)
      .then(form => res.json(form))
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

  updateForm = (req: Request, res: Response, next: any) => {
    this.formService.updateForm(req.body)
      .then(form => res.json(form))
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

  deleteForm = (req: Request, res: Response, next: any) => {
    this.formService.deleteForm(req.params['name'])
      .then(_ => res.status(204).send())
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

}