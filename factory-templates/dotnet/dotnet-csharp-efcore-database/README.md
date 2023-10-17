# C# .NET Database Library
*This project was scaffolded using Shaman Factory*

This c# database library is intended to store data access models, and could be installed in other projects, or built and published to a NuGet repository. 

## Building the Project

If you scaffolded this project as part of a ["solution"](https://www.npmjs.com/package/shaman-factory#scaffold-solution-command) then you can use Shaman Factory to build this project. Open a command line interface (CMD, bash, etc.) and navigate to your solution folder (where your shaman.json file is located), and run the following command:

```sh
sf build
```

If you scaffolded this project [manually](https://www.npmjs.com/package/shaman-factory#scaffold-command) then you can use the dotnet command to build the project. Open a command line interface (CMD, bash, etc.) and navigate to the database library project folder, then run the following command:

```sh
dotnet build
```

## Installing in Other Projects

To install this database library in another c# project (lets call it *parent* library), first build the database library project. Once the build is complete, open a command line interface (CMD, bash, etc.) and navigate to the project that will *depend* on the database library (*parent* library), then run the following command:

```sh
dotnet add ./[name of your project].csproj reference [relative path to database library project].csproj
```

## Publish to a NuGet Repository

To publish this library to a NuGet repository, first build the project. Once the project has been built, open a command line interface (CMD, bash, etc.) and navigate to the library project folder, then run the following commands:

```sh
# GENERATE A .nupkg FILE
dotnet pack

# PUBLISH NUGET PACKAGE 
dotnet nuget push [name of generated .nupkg file] --api-key [your api key] --source https://api.nuget.org/v3/index.json
```

*Note: for the push command to work, you must have a NuGet account, and have an available API key.*

## Adding Data Access Models

This project comes pre-installed with Entity Framework Core, which is an ORM-style library that allows you to access any number of databases (SQL, Cosmos, SqlLite, etc.) using a simple, familiar ORM syntax. The initial scaffolding includes 1 table called "user", and a "database context" (used to interact with database objects). Once you have installed this database library as a dependency in another project, that project can use this database context to perform operations on a configured database. As you add and remove models (tables and views), make sure to update the database context file.