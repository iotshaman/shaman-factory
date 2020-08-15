import * as _bcrypt from 'bcryptjs';
import { injectable } from 'inversify';
import { Website } from 'shaman-website-compiler';
import { IoC, TYPES } from "../composition/app.composition";
import { WebsiteContext } from '../models/website.context';
import { Form } from '../models/form';
import { FormSubmission } from '../models/form-submission';

export interface IFormService {
  getAllForms: () => Promise<Form[]>;
  getForm: (uuid: string) => Promise<Form>;
  addForm: (uuid: string, name: string, description: string) => Promise<Form>;
  updateForm: (form: Form) => Promise<Form>;
  deleteForm: (uuid: string) => Promise<void>;
  getAllFormSubmissions: () => Promise<FormSubmission[]>;
  getFormSubmission: (uuid: string) => Promise<FormSubmission>;
  submitForm: (form: FormSubmission) => Promise<FormSubmission>;
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

  getForm = (uuid: string): Promise<Form> => {
    return Promise.resolve(
      this.context.models.forms.find(uuid)
    )
  }

  addForm = (uuid: string, name: string, description: string): Promise<Form> => {
    let form = new Form(uuid, name, description);
    this.context.models.forms.add(uuid, form);
    return this.context.saveChanges()
      .then(_ => this.updateFormTemplates())
      .then(_ => this.context.models.forms.find(uuid));
  }

  updateForm = (form: Form): Promise<Form> => {
    return new Promise((res, ex) => {
      this.context.models.forms.upsert(form.uuid, form)
      this.context.saveChanges()
        .then(_ => this.updateFormTemplates())
        .then(_ => res(this.context.models.forms.find(form.uuid)))
        .catch(err => ex(err));
    })
  }

  deleteForm = (uuid: string): Promise<void> => {
    return Promise.resolve(this.context.models.forms.delete(uuid))
      .then(_ => this.context.saveChanges())
      .then(_ => this.updateFormTemplates());
  }

  getAllFormSubmissions = (): Promise<FormSubmission[]> => {
    return new Promise(res => {
      let submissions = this.context.models.submissions.filter(f => !!f);
      res(submissions.sort((a, b) => { return a.date > b.date ? 1 : -1 }));
    })
  }

  getFormSubmission = (uuid: string): Promise<FormSubmission> => {
    return new Promise((res, err) => {
      let submission = this.context.models.submissions.find(uuid);
      this.context.models.submissions.update(uuid, s => { s.received = true; return s; });
      this.context.saveChanges().then(_ => res(submission)).catch(ex => err(ex));
    });
  }

  submitForm = (form: FormSubmission): Promise<FormSubmission> => {
    return new Promise((res, err) => {
      let submission = new FormSubmission(form.formUuid, form.values);
      let source = this.context.models.forms.find(form.formUuid);
      submission.formName = source.name;
      this.context.models.submissions.add(submission.uuid, submission)
      this.context.saveChanges().then(_ => res(submission)).catch(ex => err(ex));
    });
  }

  private updateFormTemplates = (): Promise<void> => {
    let templates = ['src.website/index.html', 'src.website/form.html'];
    let operations = templates.map(t => this.website.fileChanged(t));
    return Promise.all(operations).then(_ => (null));
  }

}