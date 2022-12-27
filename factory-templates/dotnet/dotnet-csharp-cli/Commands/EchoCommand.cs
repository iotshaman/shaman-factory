using System;
using System.Threading.Tasks;

namespace Shaman.CommandLineUtility.Commands;

public class EchoCommand : ICommand
{
    public string Name => "echo";

    public Task<bool> Run()
    {
        Console.Write("Enter text to echo: ");
        var text = Console.ReadLine();

        if (string.IsNullOrEmpty(text))
        {
            Console.WriteLine("No text found.");
            return Task.FromResult(false);
        }

        Console.WriteLine(text);
        return Task.FromResult(true);
    }
}
