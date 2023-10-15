const fs = require('fs');
const _path = require('path');
let Zip = require('adm-zip');

const pkg = require('./package.json');
var pkgVersion = pkg.version;
const solution = require('./shaman.json');
const projects = solution.projects;

cleanDistFolder();
projects.reduce((a, b) => a.then(async _ => await zipProject(b)), Promise.resolve());
let templates = projects.map(p => ({
  name: p.template,
  environment: p.environment,
  type: p.type,
  version: pkgVersion,
  file: `${p.path}-v${pkgVersion}.zip`,
  language: p.language
}));
var templateFilePath = _path.join(__dirname, 'dist', 'templates.json');
writeJson(templateFilePath, {templates});

//////////////////////////////////////////
// HELPER METHODS
//////////////////////////////////////////

function cleanDistFolder() {
  let distFolder = _path.join(__dirname, 'dist');
  if (fs.existsSync(distFolder)) fs.rmSync(distFolder, {recursive: true});
  fs.mkdirSync(distFolder);
  fs.mkdirSync(_path.join(distFolder, 'node'));
  fs.mkdirSync(_path.join(distFolder, 'dotnet'));
}

async function zipProject(project) {
  let templatePath = _path.join(project.path, 'template.json');
  let template = await getJsonFileContents(templatePath);
  let zipFile = new Zip();
  template.files.forEach(f => {
    let filePath = _path.join(__dirname, project.path, f);
    zipFile.addLocalFile(filePath);
  });
  template.folders.forEach(f => {
    let folderPath = _path.join(__dirname, project.path, f);
    zipFile.addLocalFolder(folderPath, f);
  });
  var filename = `${template.name}-v${pkgVersion}.zip`;
  var filepath = _path.join(__dirname, 'dist', project.environment, filename);
  await writeZip(filepath, zipFile);
}

function getJsonFileContents(filePath) {
  return new Promise((res, err) => {
    fs.readFile(filePath, function(ex, data) {
      if (!!ex) err(ex);
      res(JSON.parse(data.toString()));
    });
  })
}

function writeZip(filePath, zipFile) {
  return new Promise((res, err) => {
    zipFile.writeZip(filePath, ex => {
      if (!!ex) return err(ex);
      res();
    });
  })
}

function writeJson(filePath, json) {
  return new Promise((res, err) => {
    let data = JSON.stringify(json, null, 2);
    fs.writeFile(filePath, data, function(ex) {
      if (!!ex) err(ex);
      res();
    });
  })
}