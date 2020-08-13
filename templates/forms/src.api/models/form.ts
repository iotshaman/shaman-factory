export class Form {

  uuid: string;
  route: string;
  name: string;
  description: string;
  inputs: FormRow[];
  actions: string[];

  constructor(uuid: string, name: string, description: string) {
    this.uuid = uuid;
    this.route = `${uuid}.html`;
    this.name = name;
    this.description = description;
    this.inputs = [];
    this.actions = [];
  }

}

export class FormRow {
  uuid: string;
  index: number;
  label: string;
  size: string;
  type: string;
  options: string[];
}