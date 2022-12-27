using System.Threading.Tasks;

namespace Shaman.CommandLineUtility.Commands;

public interface ICommand
{
    string Name { get; }
    Task<bool> Run();
}