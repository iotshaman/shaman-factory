using Microsoft.EntityFrameworkCore;
using SampleDatabaseLibrary.Models;

namespace Shaman.SampleCsharpDatabaseLibrary;

public interface ISampleDataContext
{
    DbSet<User> Users { get; set; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
