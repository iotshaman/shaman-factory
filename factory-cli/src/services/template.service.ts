import * as _path from 'path';
import * as os from 'os';
import { TemplateAuthorization } from '../models/solution';
import { Template } from "../models/template";
import { FileService, IFileService } from './file.service';
import { HttpService } from './http.service';

export interface ITemplateService {
  getTemplate: (environment: string, templateName: string, language?: string) => Promise<Template>;
  getCustomTemplate: (environment: string, templateName: string, solution: TemplateAuthorization, language?: string) => Promise<Template>
  getAllTemplates: () => Promise<Template[]>;
  unzipProjectTemplate: (template: Template, folderPath: string) => Promise<void>;
  unzipCustomProjectTemplate: (template: Template, folderPath: string) => Promise<void>;
}

export class TemplateService extends HttpService implements ITemplateService {

  constructor() {
    super('http://localhost:3000/api/projectTemplate');
  }

  fileService: IFileService = new FileService();
  dataFolder: string[] = [__dirname, '..', '..', 'data'];

  getTemplate = (environment: string, templateName: string): Promise<Template> => {
    let path = _path.join(...this.dataFolder, 'templates.json');
    return this.fileService.readJson<{ templates: Template[] }>(path).then(data => {
      let template = data.templates.find(t => t.environment == environment && t.name == templateName);
      if (!template) throw new Error(`Project type not found: ${environment} ${templateName}`);
      return template;
    });
  }

  getCustomTemplate = (environment: string, templateName: string, auth?: TemplateAuthorization, language?: string): Promise<Template> => {
    if (!auth) return Promise.reject(new Error('Authorization object not provided in shaman.json file.'));
    if (!auth.email) return Promise.reject(new Error('Authorization email not provided in shaman.json file.'));
    if (!auth.token) return Promise.reject(new Error('Authorization token not provided in shaman.json file.'));
    if (!auth.email.includes('@')) return Promise.reject(new Error("Invalid email address in authorization config."));
    let tempFilePath = "";
    let headers = {
      'x-template-environment': environment,
      'x-template-name': templateName,
      'x-template-language': language ? language : "",
      'x-auth-email': auth.email,
      'x-auth-token': auth.token
    }
    return this.buildCustomTemplateFolder(environment, auth.email)
      .then(tempDir => tempFilePath = _path.join(tempDir, `${templateName.replace(/ /g, '-')}.zip`))
      .then(_ => this.downloadFile('download', tempFilePath, headers))
      .then(_ => {
        let template = new Template();
        template.environment = environment;
        template.name = templateName;
        template.version = "1.0.0";
        template.file = tempFilePath;
        return template;
      })
      .catch(_ => {
        return Promise.reject(new Error('Failed to download custom template. Please check your shaman.json file ' +
          'and ensure your authorization information is correct and your token is not expired. ' +
          'Also check that your project name and environment are correct.'));
      });
  }

  getAllTemplates = (): Promise<Template[]> => {
    let path = _path.join(...this.dataFolder, 'templates.json');
    return this.fileService.readJson<{templates: Template[]}>(path)
    .then(data => data.templates);
  }

  unzipProjectTemplate = (template: Template, folderPath: string): Promise<void> => {
    let templatePath = _path.join(...this.dataFolder, 'templates', template.file);
    return this.fileService.unzipFile(templatePath, folderPath);
  }

  unzipCustomProjectTemplate = (template: Template, folderPath: string): Promise<void> => {
    return this.fileService.unzipFile(template.file, folderPath);
  }

  private buildCustomTemplateFolder = (environment: string, userEmail: string): Promise<string> => {
    let emailPrefix = userEmail.split('@')[0];
    let tmpDir = _path.join(os.tmpdir(), 'shaman', emailPrefix, environment);
    return this.fileService.createFolderRecursive(tmpDir).then(_ => (tmpDir))
  }

}