# C# .NET Command Line Utility
*This project was scaffolded using Shaman CLI*

This c# command line utility project contains all the code scaffolding necessary to provide a simple command line interface. The project is built using .NET 6, and leverages .NET's built-in dependency injection capabilities. It comes pre-built with app configuration, a default control loop, a default menu command, and a sample echo command.

## Building the Project

If you scaffolded this project as part of a ["solution"](https://www.npmjs.com/package/shaman-cli#scaffold-solution-command) then you can use Shaman CLI to build this project. Open a command line interface (CMD, bash, etc.) and navigate to your solution folder (where your shaman.json file is located), and run the following command:

```sh
shaman build
```

If you scaffolded this project [manually](https://www.npmjs.com/package/shaman-cli#scaffold-command) then you can use the dotnet command to build the project. Open a command line interface (CMD, bash, etc.) and navigate to the server project folder, then run the following command:

```sh
dotnet build
```

## Starting the Server

*Note: you will need to build the CLI project before starting*

If you scaffolded this project as part of a ["solution"](https://www.npmjs.com/package/shaman-cli#scaffold-solution-command) then you can use Shaman CLI to start the CLI. Open a command line interface (CMD, bash, etc.) and navigate to your solution folder (where your shaman.json file is located), and run the following command:

```sh
shaman run [project]
```

**Important:** replace "[project]" with the name of your server project, as specified in your solution file.

If you scaffolded this project [manually](https://www.npmjs.com/package/shaman-cli#scaffold-command) then you can use the dotnet command to start the CLI. Open a command line interface (CMD, bash, etc.) and navigate to the server project folder, then run the following command:

```sh
dotnet run
```

## Application Configuration

This project comes with built-in application configuration. There are 2 files that are important for application configuration:

- `appsettings.json`
- `Configuration/AppConfig.cs`

The "appsettings.json" file should match the schema in your actual config file, but should not store any real values that are secret (passwords, configuration strings, etc) since it will get checked into your repository.

The last file in the list, `Configuration/AppConfig.cs`, is the configuration model. As you add and remove properties in your json config files, make sure to update the model so other classes will have access to the correct properties.
