# C# .NET Server
*This project was scaffolded using Shaman CLI*

This c# server project contains all the code scaffolding necessary to provide a RESTful API over HTTP. The server is built using .NET 6, and leverages .NET's built-in dependency injection capabilities. It comes pre-built with app configuration, Serilog (for log multiplexing), Swagger (Open API) "living" documentation, and a health-check controller. 

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

*Note: you will need to build the server project before starting the server*

If you scaffolded this project as part of a ["solution"](https://www.npmjs.com/package/shaman-cli#scaffold-solution-command) then you can use Shaman CLI to start the server. Open a command line interface (CMD, bash, etc.) and navigate to your solution folder (where your shaman.json file is located), and run the following command:

```sh
shaman run [project]
```

**Important:** replace "[project]" with the name of your server project, as specified in your solution file.

If you scaffolded this project [manually](https://www.npmjs.com/package/shaman-cli#scaffold-command) then you can use the dotnet command to start the server. Open a command line interface (CMD, bash, etc.) and navigate to the server project folder, then run the following command:

```sh
dotnet run
```

To test that everything is working as expected, open a browser and enter the following into the URL box: `http://localhost:5000/api/health`. The resulting web page should look like this:

```json
{"status":"healthy"}
```

## Application Configuration

This project comes with built-in application configuration. There are 3 files that are important for application configuration:

- `appsettings.json`
- `appsettings.Development.json`
- `Configuration/AppConfig.cs`

The "appsettings.Development.json" file will not be pushed to your git repository (since it is included in the .gitignore file), and is where you should store your local application configuration. The "appsettings.json" file should match the schema in your actual config file, but should not store any real values that are secret (passwords, configuration strings, etc) since it will get checked into your repository. The purpose of the 'appsettings.json file is to make sharing code easy, simply have someone download your repository, copy the "appsettings.json" file into an "appsettings.Development.json" file, and then provide them with real values. 

The last file in the list, `Configuration/AppConfig.cs`, is the configuration model. As you add and remove properties in your json config files, make sure to update the model so other classes will have access to the correct properties.

## Add a Controller

Adding a controller to the c# server project is incredibly easy, simply add a new Class file to the `Controllers` folder (make sure the file name ends with "Controller.cs") and add the following decorations / interfaces to the class:

```csharp
[ApiController]
public class SampleController : ControllerBase
{
  [HttpGet("api/my-endpoint")]
  public IActionResult SampleGet()
  {
    // IMPLEMENT GET REQUEST
  }
}
```

## Dependency Injection

Dependency inject (DI) is an application composition technique, often associated with In inversion-of-control, that aims to improve code quality by:

1. Making code more testable
2. Reducing the coupling between objects
3. Making code more reusable
4. Reducing boiler plate code (since we dont have to manually create instances of classes)

The main concept behind dependency injection is that application components should only focus on their primary intent, and making instances of dependencies is rarely the stated intent of a given class / object. For example, a `UserService` class should only focus on CRUD (Create/Read/Update/Delete) operations, and not worry about how to create an instance of a database context class. Instead, we should rely on the underlying framework to handle the *instantiation* of dependencies, and then provide these dependencies to any classes / objects that require them (hence, dependency injection). 

Dependency injection is included by default with all modern .NET environments (.NET Core, .NET 5 / 6). When you scaffold a c# server project using the Shaman CLI, a folder called `Composition` will be added to the server project, and a file called `ServiceCollectionExtensions.cs` will be created to handle DI composition. 

### Make an Interface Available Through Dependency Injection
To make something available through depdendency injection, first make an interface, then create a class that implements this interface. For example, here is a trivial interface + class:

```csharp
public interface ISampleInterface {
  string name { get; set; }
}
public class ConcreteImplementation : ISampleInterface {
  public string name { get; set; }
}
```

Once your concrete implementation is ready for use, open the `ServiceCollectionExtensions.cs` file and add the following line to the "AddServices" method (before the return statement):

```csharp
services.AddTransient<ISampleInterface, ConcreteImplementation>();
```

*Note:* this only works if every item in the constructor for "ConcreteImplementation" is also available through DI; if "ConcreteImplementation" depends on an interface that is not provided to the "ServiceCollection", you will get an error alerting you that "ConcreteImplementation" has an unmet dependency.

If you need more control over the constuction of the "ConcreteImplementation" class (for example, it needs a value from the app config), you can use a lambda expression to get access to the "service provider" (built from "ServiceCollection") then manually construct your class. For example:

```csharp
services.AddTransient<ISampleInterface>(s => {
  var config = s.GetService<IOptions<AppConfig>>().Value;
  return new ConcreteImplementation(config.SomeConfigurableValue);
});
```