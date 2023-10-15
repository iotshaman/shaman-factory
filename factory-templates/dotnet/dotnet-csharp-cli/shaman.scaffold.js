const fs = require('fs');
const _path = require('path');

const project = require('./shaman.scaffold.json');
if (!project.name) {
  console.error("Name not available to dotnet scaffold script.");
  process.exit(1);
}
const files = getAllSourceFiles(__dirname);
files.reduce((a, b) => 
  a.then(_ => updateSourceFileNamespace(b)), Promise.resolve())
  .then(_ => { console.log("Project specs have been applied."); process.exit(0); });

function getAllSourceFiles(path, aggregate = []) {
  let files = fs.readdirSync(path);
  files.forEach(function(file) {
    let filePath = _path.join(path, file);
    if (fs.statSync(filePath).isDirectory()) 
      aggregate = getAllSourceFiles(_path.join(path, file), aggregate);
     else if (file.endsWith(".cs")) 
      aggregate.push(_path.join(path, "/", file));
  });
  return aggregate;
}

async function updateSourceFileNamespace(filePath) {
  const contents = await getFileContents(filePath);
  const updatedContents = contents.toString().replace(/Shaman.CommandLineUtility/g, project.name);
  return await updateFileContents(filePath, updatedContents);
}

function getFileContents(filePath) {
  return new Promise((res, err) => {
    fs.readFile(filePath, function(ex, data) {
      if (!!ex) err(ex);
      res(data.toString());
    });
  })
}

function updateFileContents(filePath, data) {
  return new Promise((res, err) => {
    fs.writeFile(filePath, data, function(ex) {
      if (!!ex) err(ex);
      res();
    });
  })
}