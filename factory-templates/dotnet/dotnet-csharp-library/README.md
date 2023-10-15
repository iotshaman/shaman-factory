# C# .NET Library
*This project was scaffolded using Shaman Factory*

This c# library is intended to store shared code, and could be installed in other projects, or built and published to a NuGet repository. 

## Building the Project

If you scaffolded this project as part of a ["solution"](https://www.npmjs.com/package/shaman-factory#scaffold-solution-command) then you can use Shaman Factory to build this project. Open a command line interface (CMD, bash, etc.) and navigate to your solution folder (where your shaman.json file is located), and run the following command:

```sh
sf build
```

If you scaffolded this project [manually](https://www.npmjs.com/package/shaman-factory#scaffold-command) then you can use the dotnet command to build the project. Open a command line interface (CMD, bash, etc.) and navigate to the library project folder, then run the following command:

```sh
dotnet build
```

## Installing in Other Projects

To install this library in another c# project (lets call it *parent* library), first build the library project. Once the build is complete, open a command line interface (CMD, bash, etc.) and navigate to the project that will *depend* on the library (*parent* library), then run the following command:

```sh
dotnet add ./[name of your project].csproj reference ../[library project folder]/[name of library project].csproj
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