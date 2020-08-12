import { FormSubmission } from "../../models/form-submission";
import { FormActionResponse } from "../../models/form-action-response";

export interface IFormAction {
  name: string;
  process: (form: FormSubmission) => Promise<FormActionResponse>;
}