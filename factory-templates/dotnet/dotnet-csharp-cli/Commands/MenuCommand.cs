using System;
using System.Threading.Tasks;

namespace Shaman.CommandLineUtility.Commands;

public class MenuCommand : ICommand
{
    public string Name => "menu";

    public Task<bool> Run()
    {
        Console.WriteLine($"{Environment.NewLine}Please choose from one of the following options:");
        Console.WriteLine("Type 'menu' to display this menu.");
        Console.WriteLine("Type 'echo' to open echo cli.");
        Console.WriteLine($"Type 'exit' to close CLI.{Environment.NewLine}");
        return Task.FromResult(true);
    }
}