const fs = require('fs');
const _path = require('path');

const project = require('./shaman.scaffold.json');
if (!project.name) {
  console.error("Name not available to dotnet scaffold script.");
  process.exit(1);
}
const files = getAllSourceFiles(__dirname);
files.reduce((a, b) => 
    a.then(_ => updateSourceFileNamespace(b)), Promise.resolve()
  )
  .then(_ => renameDatabaseContextFiles())
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
  let updatedContents = contents.toString().replace(/Shaman.SampleCsharpDatabaseLibrary/g, project.name);
  if (!!project.specs?.contextName && filePath.endsWith('SampleDataContext.cs')) {
	 updatedContents = updatedContents.replace(/SampleDataContext/g, project.specs.contextName);
  }
  return await updateFileContents(filePath, updatedContents);
}

function renameDatabaseContextFiles() {
  let contextName = project.specs?.contextName;
  if (!contextName) return Promise.resolve();
	const tasks = [
    renameFile(_path.join(__dirname, "SampleDataContext.cs"), _path.join(__dirname, `${contextName}.cs`)),
    renameFile(_path.join(__dirname, "ISampleDataContext.cs"), _path.join(__dirname, `I${contextName}.cs`))
  ]
  return Promise.all(tasks).then(_ => (null));
}

function getFileContents(filePath) {
  return new Promise((res, err) => {
    fs.readFile(filePath, function(ex, data) {
      if (!!ex) return err(ex);
      return res(data.toString());
    });
  })
}

function updateFileContents(filePath, data) {
  return new Promise((res, err) => {
    fs.writeFile(filePath, data, function(ex) {
      if (!!ex) return err(ex);
      return res();
    });
  })
}

function renameFile(filePath, newFilePath) {
  return new Promise((res, err) => {
    fs.rename(filePath, newFilePath, function(ex) {
      if (!!ex) return err(ex);
      return res();
    });
  })
}