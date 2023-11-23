    # Typescript Database Library
*This project was scaffolded using Shaman Factory*

This typescript database library is intended to store data access models, and could be installed in other projects, or built and published to an npm repository. 

## Building the Project

If you scaffolded this project as part of a ["solution"](https://www.npmjs.com/package/shaman-factory#scaffold-solution-command) then you can use Shaman Factory to build this project. Open a command line interface (CMD, bash, etc.) and navigate to your solution folder (where your shaman.json file is located), and run the following command:

```sh
sf build node
```

If you scaffolded this project [manually](https://www.npmjs.com/package/shaman-factory#scaffold-command) then you can use the npm command to build the project. Open a command line interface (CMD, bash, etc.) and navigate to the database library project folder, then run the following command:

```sh
npm run build
```

## Installing in Other Projects

To install this library project in another typescript project, first build the project. Once the project has been built, open the package.json file for the other project (the one that will be *dependent* on this database library project). Now add a property to the "dependency" property that follows the below pattern (note: you may need to create the "dependency" property, if you don't yet have any dependencies):

```json
{
    ...
    "dependencies": {
        "sample-database": "file:../database"
    }
    ...
}
```

The name of the dependency property should reflect the value in the database library project's package.json "name" property. The value of the dependency property should be a relative (or absolute) path to the database library project's folder.

## Publish to NPM Repository

To publish this library to the NPM repository, first build the project. Once the project has been built, open the project's package.json file and change the "private" property to false (or remove it). You will also want to change the "name" property in your package.json, since this value must be unique across all npm packages. Finally, open a command line interface (CMD, bash, etc.) and navigate to the database library project folder, then run the following command:

```sh
npm publish
```

*Note: for the publish command to work, you must have an npm account, and be logged in using the npm CLI.

## Adding Data Access Models

This project comes pre-installed with [Sqlite Shaman](https://www.npmjs.com/package/sqlite-shaman), which is an ORM-style library that allows you to access Sqlite databases using a simple, familiar ORM syntax. The initial scaffolding includes 1 table called "user", and a database context. Once you have installed this database library as a dependency in another project, that project can use this database context to perform operations on a configured Sqlite database. As you add and remove models (tables and views), make sure to update the database context file, as well as the "index.ts" file (this is what exports your models for other projects to use).  
