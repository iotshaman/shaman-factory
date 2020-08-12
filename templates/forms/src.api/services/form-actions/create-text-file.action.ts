import { injectable } from 'inversify';
import { IFormAction } from './form-action';
import { FormSubmission } from '../../models/form-submission';
import { FormActionResponse } from '../../models/form-action-response';

@injectable()
export class CreateTextFileAction implements IFormAction {
  
  get name(): string { return "create-text-file"}

  process = (form: FormSubmission): Promise<FormActionResponse> => {
    return new Promise((res, _err) => {
      let text = 'sample text';
      res(new FormActionResponse((response => {
        response.attachment("sample-file.txt");
        response.type("txt");
        response.send(text);
      })));
    })
  }

}