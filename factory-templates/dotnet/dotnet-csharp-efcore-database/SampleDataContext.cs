using System.Diagnostics.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using SampleDatabaseLibrary.Models;

namespace Shaman.SampleCsharpDatabaseLibrary;

[ExcludeFromCodeCoverage]
public class SampleDataContext : DbContext, ISampleDataContext
{
    public SampleDataContext(DbContextOptions options) : base(options)
    {
    }

    public virtual DbSet<User>? Users { get; set; }
}
