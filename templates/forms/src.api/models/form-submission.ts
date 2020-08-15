import { v4 } from 'uuid';

export class FormSubmission {
  
  uuid: string;
  formUuid: string;
  formName: string;
  values: FormInputValue[];
  action?: string;
  date: string;
  received: boolean;

  constructor(formUuid: string, values: FormInputValue[], action?: string) {
    this.uuid = v4();
    this.formUuid = formUuid;
    this.values = values;
    this.action = action;
    this.date = (new Date()).toISOString();
    this.received = false;
  }

}

export class FormInputValue {
  inputUuid: string;
  label: string;
  value: string;
}