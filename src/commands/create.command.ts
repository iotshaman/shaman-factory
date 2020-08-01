import * as _fsx from 'fs-extra';
import * as _path from 'path';
import * as _cmd from 'child_process';
import { ICommand } from "./command";

export class CreateCommand implements ICommand {

  get name(): string { return "create"; }
  /* istanbul ignore next */
  private npm: string = process.platform === 'win32' ? 'npm.cmd' : 'npm';

  run = (name: string, template: string = "default"): Promise<void> => {
    if (!name) throw new Error("Name parameter not provided to create command.");
    console.log(`Creating website '${name}' from template '${template}'...`);
    return this.getTemplates()
      .then(templates => this.checkTemplateExists(template, templates))
      .then(_ => this.copyFiles(name, template))
      .then(_ => this.installDependencies(name))
      .then(_ => console.log("Website has been created."));
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
  
  installDependencies = (name: string): Promise<void> => {
    return new Promise((res, err) => {
      console.log("Installing dependencies...")
      var path = `./${name}`;
      _cmd.exec(`${this.npm} install`, { cwd: path}, function(ex, _stdout, stderr) {
        if (ex) return err(ex);
        if (stderr) console.log(stderr);
        res();
      });
    })
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