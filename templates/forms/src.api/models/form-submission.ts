export class FormSubmission {
  uuid: string;
  formUuid: string;
  values: FormInputValue[];
  action?: string;
}

export class FormInputValue {
  inputUuid: string;
  value: string;
}