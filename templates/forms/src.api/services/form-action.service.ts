import * as _bcrypt from 'bcryptjs';
import { injectable } from 'inversify';
import { IoC, TYPES } from "../composition/app.composition";
import { IFormAction } from './form-actions/form-action';
import { FormSubmission } from '../models/form-submission';
import { FormActionResponse } from '../models/form-action-response';

export interface IFormActionService {
  processFormAction: (form: FormSubmission) => Promise<FormActionResponse>;
}

@injectable()
export class FormActionService implements IFormActionService {

  private actions: IFormAction[];

  constructor() {
    this.actions = IoC.getAll<IFormAction>(TYPES.FormAction);
  }

  processFormAction = (form: FormSubmission): Promise<FormActionResponse> => {
    let action = this.actions.find(a => a.name == form.action);
    if (!action) return Promise.reject(`Action '${form.action}' not found.`);
    return action.process(form);
  }

}