# Node JS Templates
To scaffold and run your code in a Node JS environment (using Typescript), use the value "node" for the "environment" property of your project definition (shaman.json file -> projects). The proceeding templates are available in the "node" environment, and can "include" references (dependencies) to other projects of type "node". 

## Languages
The "node" environment only supports the Typescript language. You do not need to specify this in your "project" definitions (shaman.json), since the value "typescript" will be used be default.

## Server Template
The NodeJS server template is built on top of ExpressJS and comes pre-built with the following features:

1. Express API port configuration
2. Default CORS configuration
3. JSON body parser configuration
4. HTTP request router
5. Dependency Injection (InversifyJS)
6. Simple JSON file service
7. Health-check controller
8. Transformation hooks for configuration / routing / composition

To create a project based on the NodeJS server template, use the following project configuration:

```json
{
  "name": "sample-node-solution",
  "projects": [
    {
      "name": "[name of your server project]",
      "environment": "node",
      "template": "node-express-server",
      "path": "[where you want to store your code]",
      "include": [ //optional
        "some-dependent-project",
        "another-dependent-project",
        "you-get-the-idea"
      ]
    }
  ]
}
```

### Specs
The following specs can be configured to customize your server project:

#### Executable
When publishing, this property will instruct Shaman Factory to create an npm script in the publish output (recommended). To configure, provide a property named "exectuable" to your server's "specs" property, and set the value (boolean) to true.

### Transformations
The following transformations can be applied to a scaffolded server project.

#### Compose Data Context
If you have both a server project and a database project included in your solution file, then you can use this transformation to automatically add your "data context" (the thing that abstracts database object access) to your server configuration and composition. This will save you time after scaffolding, so you don't have to manually add the database configuration to your server project and setup dependency injection. Below is a sample solution file that shows how to leverage this transformation:

```json
{
  "name": "sample-node-solution",
  "projects": [
    {
      "name": "sample-database",
      "environment": "node",
      "template": "node-shaman-database-mysql",
      "path": "database",
      "specs": {
        "contextName": "MyDataContext",
        "databaseType": "mysql"
      }
    },
    {
      "name": "sample-server",
      "environment": "node",
      "template": "node-express-server",
      "path": "server",
      "include": [
        "sample-database"
      ]
    }
  ],
  "transform": [
    {
      "targetProject": "sample-server",
      "transformation": "compose:datacontext",
      "sourceProject": "sample-database"
    }
  ]
}
```

## MySql Database Library Template
The NodeJS MySql database library template is built on top of MySQL Shaman and comes pre-built with the following features:

1. MySQL Shaman configuration
2. A placeholder "data context" (to perform data access operations against MySQL database)
3. A sample "user" model
4. A sample "user" SQL script
5. A sample "primer" script, to insert sample "user" record

To create a project based on the NodeJS database library template, use the following project configuration:

```json
{
  "name": "sample-node-solution",
  "projects": [
    {
      "name": "[name of your database library project]",
      "environment": "node",
      "template": "node-shaman-database-mysql",
      "path": "[where you want to store your code]",
      "include": [ //optional
        "some-dependent-project",
        "another-dependent-project",
        "you-get-the-idea"
      ],
      "specs": { //optional
        "contextName": "MyContext",
        "databaseType": "mysql"
      }
    }
  ]
}
```

### Specs
The following specs can be configured to customize your MySQL database library project:

#### Context Name
To specify the name of your data context, provide a property "contextName" to your database library's "specs" property; the value should be whatever you want to call your data context class.

#### Database Type
The type of database being used, in this case "mysql". This is only required if you are using the Server Template's "compose:datacontext" transformation.

### Transformations
The database library project does not yet have any transformations defined.

## SQLite Database Library Template
The NodeJS Sqlite database library template is built on top of Sqlite Shaman and comes pre-built with the following features:

1. SQLite Shaman configuration
2. A placeholder "data context" (to perform data access operations against SQLite database)
3. A sample "user" model
4. A SQLite database file (empty)
5. A SQL schema file that creates the "user" table

To create a project based on the NodeJS database library template, use the following project configuration:

```json
{
  "name": "sample-node-solution",
  "projects": [
    {
      "name": "[name of your database library project]",
      "environment": "node",
      "template": "node-shaman-database-sqlite",
      "path": "[where you want to store your code]",
      "include": [ //optional
        "some-dependent-project",
        "another-dependent-project",
        "you-get-the-idea"
      ],
      "specs": { //optional
        "contextName": "MyContext",
        "databaseType": "sqlite"
      }
    }
  ]
}
```

### Specs
The following specs can be configured to customize your SQLite database library project:

#### Context Name
To specify the name of your data context, provide a property "contextName" to your database library's "specs" property; the value should be whatever you want to call your data context class.

#### Database Type
The type of database being used, in this case "sqlite". This is only required if you are using the Server Template's "compose:datacontext" transformation.

### Transformations
The database library project does not yet have any transformations defined.

## Library Template
The NodeJS library template comes pre-built with the following features:

1. package.json / tsconfig.json configuration to support publishing library to NPM (including types)
2. Mocha unit test runner, with a sample class + unit test file.

To create a project based on the NodeJS library template, use the following project configuration:

```json
{
  "name": "sample-node-solution",
  "projects": [
    {
      "name": "[name of your library project]",
      "environment": "node",
      "template": "node-typescript-library",
      "path": "[where you want to store your code]",
      "include": [ //optional
        "some-dependent-project",
        "another-dependent-project",
        "you-get-the-idea"
      ]
    }
  ]
}
```

### Specs
The library project does not yet have any specs defined.

### Transformations
The library project does not yet have any transformations defined.

## HTML Client Template
The NodeJS client template is built on top of the Shaman Website Compiler and comes pre-built with the following features:

1. A simple website, consisting of HTML / CSS / JS / JSON files
2. Javascript file minifcation
3. CSS file minification
4. HTML file minification
5. HTML Templating (with easy-to-configure models)
6. XML Sitemap generator
7. Built-in database / api connectivity
8. File bundling (to reduce http requests)
9. Dynamic route generation (...and much more!)

To create a project based on the NodeJS client template, use the following project configuration:

```json
{
  "name": "sample-node-solution",
  "projects": [
    {
      "name": "[name of your client project]",
      "environment": "node",
      "template": "node-shaman-website",
      "path": "[where you want to store your code]",
      "include": [ //optional
        "some-dependent-project",
        "another-dependent-project",
        "you-get-the-idea"
      ],
      "runtimeDependencies": [ //optional
        "some-project-that-should-be-started-before-the-client"
      ]
    }
  ]
}
```

### Specs
The client project does not yet have any specs defined.

### Transformations
The client project does not yet have any transformations defined.