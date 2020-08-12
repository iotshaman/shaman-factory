import { Request, Response, Application, Router } from "express";
import { injectable } from 'inversify';
import { IoC, TYPES } from "../../composition/app.composition";
import { ControllerBase } from "../controller.base";
import { IFormService } from "../../services/form.service";
import { RouteError } from "../../models/route-error";
import { IFormActionService } from "../../services/form-action.service";

@injectable()
export class FormController extends ControllerBase {

  private router: Router;
  private formService: IFormService;
  private formActionService: IFormActionService;

  constructor(private app: Application) {
    super();
    this.configure();
    this.formService = IoC.get<IFormService>(TYPES.FormService);
    this.formActionService = IoC.get<IFormActionService>(TYPES.FormActionService);
  }

  private configure = () => {
    this.router = Router();
    this.router
      .get('/', this.authorize, this.getAllForms)
      .get('/submissions/', this.authorize, this.getAllFormSubmissions)
      .get('/:uuid', this.authorize, this.getForm)
      .get('/submissions/:uuid', this.authorize, this.getFormSubmission)
      .put('/', this.authorize, this.addForm)
      .post('/', this.authorize, this.updateForm)
      .post('/submit', this.submitForm)
      .delete('/:uuid', this.authorize, this.deleteForm)

    this.app.use('/api/form', this.router);
  }

  getAllForms = (_req: Request, res: Response, next: any) => {
    this.formService.getAllForms()
      .then(forms => res.json(forms))
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

  getForm = (req: Request, res: Response, next: any) => {
    this.formService.getForm(req.params['uuid'])
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
    this.formService.deleteForm(req.params['uuid'])
      .then(_ => res.status(204).send())
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

  getAllFormSubmissions = (req: Request, res: Response, next: any) => {
    this.formService.getAllFormSubmissions()
      .then(forms => res.json(forms))
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

  getFormSubmission = (req: Request, res: Response, next: any) => {
    this.formService.getFormSubmission(req.params['uuid'])
      .then(form => res.json(form))
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

  submitForm = (req: Request, res: Response, next: any) => {
    this.formService.submitForm(req.body)
      .then(_ => res.status(204).send())
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

  processFormAction = (req: Request, res: Response, next: any) => {
    this.formActionService.processFormAction(req.body)
      .then(rslt => {
        if (!rslt.response) return res.status(204).send();
        return rslt.response(res.status(200));
      })
      .catch((ex: Error) => next(new RouteError(ex.message, 400)));
  }

}