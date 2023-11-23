const fs = require('fs');
const path = require('path');

const specs = require('./shaman.scaffold.json').specs;
if (!specs["contextName"]) {
  console.log("Project specs have been applied.");
  return process.exit(0);
}

const dataContextFilePath = path.join(__dirname, 'src', 'database.context.ts');
const updateTask = getFileContents(dataContextFilePath).then(contents => {
  const updatedDataContextFile = contents.toString().replace(/SampleDatabaseContext/g, specs["contextName"]);
  return updateFileContents(dataContextFilePath, updatedDataContextFile);
});
updateTask.then(_ => console.log("Project specs have been applied."));

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