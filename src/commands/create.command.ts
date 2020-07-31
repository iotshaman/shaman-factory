import * as _fsx from 'fs-extra';
import * as _path from 'path';
import { ICommand } from "./command";

export class CreateCommand implements ICommand {

  get name(): string { return "create"; }

  run = (name: string, template: string = "default"): Promise<void> => {
    if (!name) throw new Error("Name parameter not provided to create command.");
    return this.getTemplates()
      .then(templates => this.checkTemplateExists(template, templates))
      .then(_ => this.copyFiles(name, template));
  }

  private getTemplates = (): Promise<string[]> => {
    return _fsx.readdir(_path.join(__dirname, '../../templates'));
  }

  private checkTemplateExists = (template: string, templates: string[]) => {
    if (!templates.find(t => t == template)) throw new Error(`Invalid template '${template}'.`);
  }

  private copyFiles = (name: string, template: string) => {
    let templatePath = _path.join(__dirname, '../../templates', template);
    let outputPath = _path.join(process.cwd(), name);
    let jsonPackageFile = _path.join(outputPath, 'package.json');
    return _fsx.pathExists(outputPath)
      .then(exists => { if (exists) throw new Error("Path already exists."); })
      .then(_ => _fsx.ensureDir(outputPath))
      .then(_ => _fsx.copy(templatePath, outputPath))
      .then(_ => _fsx.writeFile(jsonPackageFile, CreateJsonPackage(name)))
  }

}

function CreateJsonPackage(name: string): string {
  return `{
    "name": "${name}",
    "version": "1.0.0",
    "description": "",
    "main": "index.js",
    "private": true,
    "scripts": {
      "start": "node index.js"
    },
    "dependencies": {
      "shaman-website-compiler": "^4.0.4"
    }
  }`
}