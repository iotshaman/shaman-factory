import * as _bcrypt from 'bcryptjs';
import { injectable } from 'inversify';
import { Website } from 'shaman-website-compiler';
import { IoC, TYPES } from "../composition/app.composition";
import { WebsiteContext } from '../models/website.context';
import { Form } from '../models/form';

export interface IFormService {
  getAllForms: () => Promise<Form[]>;
  getForm: (name: string) => Promise<Form>;
  addForm: (uuid: string, name: string, description: string) => Promise<Form>;
  updateForm: (form: Form) => Promise<Form>;
  deleteForm: (name: string) => Promise<void>;
}

@injectable()
export class FormService implements IFormService {

  private website: Website;
  private context: WebsiteContext;

  constructor() {
    this.website = IoC.get<Website>(TYPES.Website);
    this.context = IoC.get<WebsiteContext>(TYPES.WebsiteContext);
  }

  getAllForms = (): Promise<Form[]> => {
    return Promise.resolve(
      this.context.models.forms.filter(b => !!b)
    );
  }

  getForm = (name: string): Promise<Form> => {
    return Promise.resolve(
      this.context.models.forms.find(name)
    )
  }

  addForm = (uuid: string, name: string, description: string): Promise<Form> => {
    let form = new Form();
    form.uuid = uuid;
    form.name = name;
    form.description = description;
    form.inputs = [];
    form.actions = [];
    this.context.models.forms.add(name, form);
    return this.context.saveChanges()
      .then(_ => this.context.models.forms.find(name));
  }

  updateForm = (form: Form): Promise<Form> => {
    return new Promise((res, ex) => {
      this.context.models.forms.upsert(form.name, form)
      this.context.saveChanges()
        .then(_ => this.updateFormTemplates())
        .then(_ => res(this.context.models.forms.find(form.name)))
        .catch(err => ex(err));
    })
  }

  deleteForm = (name: string): Promise<void> => {
    return Promise.resolve(this.context.models.forms.delete(name))
      .then(_ => this.context.saveChanges());
  }

  private updateFormTemplates = () => {
    let templates = ['src.website/index.html'];
    let operations = templates.map(t => this.website.fileChanged(t));
    return Promise.all(operations);
  }

}