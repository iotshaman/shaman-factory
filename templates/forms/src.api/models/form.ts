export class Form {
  uuid: string;
  name: string;
  description: string;
  inputs: FormRow[];
  actions: FormAction[];
}

export class FormRow {
  uuid: string;
  index: number;
  label: string;
  size: string;
  type: string;
  options: string[];
}

export class FormAction {

}