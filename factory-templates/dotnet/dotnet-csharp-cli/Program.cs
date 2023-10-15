using Microsoft.Extensions.DependencyInjection;
using Shaman.CommandLineUtility.Commands;
using Shaman.CommandLineUtility.Composition;
using System;
using System.Linq;

var serviceCollection = new ServiceCollection();
serviceCollection.AddConfiguration();
serviceCollection.AddCommands();
serviceCollection.AddServices();
var provider = serviceCollection.BuildServiceProvider();

var commands = provider.GetServices<ICommand>().ToList();
var menuUtility = commands.Single(s => s.Name == "menu");
Console.WriteLine("Welcome to your CLI!");

await menuUtility.Run();

var selectedUtility = string.Empty;
while (selectedUtility != "exit")
{
    Console.Write("Enter Command: ");
    selectedUtility = Console.ReadLine();

    if (selectedUtility == "exit") continue;

    var command = commands.SingleOrDefault(s => s.Name == selectedUtility);
    if (command == null)
    {
        Console.WriteLine($"Invalid value provided: '{selectedUtility}'.");
        continue;
    }

    Console.WriteLine($"Running command '{selectedUtility}'.");
    await command.Run();
    Console.WriteLine($"{selectedUtility} has finished processing, please enter another command or type 'exit' to close.");
}