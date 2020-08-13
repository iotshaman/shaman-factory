import { injectable } from 'inversify';
import { render } from 'ejs';
import { IFormAction } from './form-action';
import { FormSubmission } from '../../models/form-submission';
import { FormActionResponse } from '../../models/form-action-response';
import { Website } from 'shaman-website-compiler';
import { IoC, TYPES } from '../../composition/app.composition';

@injectable()
export class CreateReceiptAction implements IFormAction {
  
  get name(): string { return "create-receipt"}
  private website: Website;

  constructor() {
    this.website = IoC.get<Website>(TYPES.Website);
  }

  process = (form: FormSubmission): Promise<FormActionResponse> => {
    return new Promise((res, _err) => {
      let template = "src.website/templates/receipt.template.html";
      let bundle = this.website.getBundleData("index.styles.bundle");
      let css = `<style>${bundle.content}</style>`
      let data = this.website.getFileData(template);
      let text = render(data.content, { css, form });
      res(new FormActionResponse((response => {
        response.status(201);
        response.send(text);
      })));
    })
  }

}