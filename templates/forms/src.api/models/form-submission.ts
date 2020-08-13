import { v4 } from 'uuid';

export class FormSubmission {
  
  uuid: string;
  formUuid: string;
  values: FormInputValue[];
  action?: string;
  date: string;

  constructor(formUuid: string, values: FormInputValue[], action?: string) {
    this.uuid = v4();
    this.formUuid = formUuid;
    this.values = values;
    this.action = action;
    this.date = (new Date()).toISOString();
  }

}

export class FormInputValue {
  inputUuid: string;
  value: string;
}