import { IListCommand } from "../../command";
import { TemplateService } from "../../../services/template.service";
import { Template } from "../../../models/template";

export class ListTemplatesCommand implements IListCommand {
  get flag(): string { return "-templates"; };
  private templateService: TemplateService = new TemplateService();

  constructor() { }

  run = (): Promise<void> => {
    return this.templateService.getAllTemplates()
      .then(templates => this.logTemplatesToConsole(templates));
  };

  private getSortedTemplatesByEnvironment = (templates: Template[]): { [environment: string]: Template[] } => {
    let sortedTemplates: { [environment: string]: Template[] } = {};
    templates.forEach(t => {
      if (!sortedTemplates[t.environment]) sortedTemplates[t.environment] = [];
      sortedTemplates[t.environment].push(t);
    });
    return sortedTemplates;
  }

  private logTemplatesToConsole = (templates: Template[]): void => {
    let sortedTemplates = this.getSortedTemplatesByEnvironment(templates);
    let environments: string[] = Object.keys(sortedTemplates);
    console.log(
      '\nAvailable templates' + 
      '\n-------------------'
    );
    environments.forEach(e => {
      console.log(`${e}:`);
      sortedTemplates[e].forEach(t => {
        console.log(`  ${t.name}`);
      });
      console.log();
    });
  }
}