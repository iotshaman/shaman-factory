using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace SampleDatabaseLibrary.Models;

[ExcludeFromCodeCoverage]
[Table("User", Schema = "dbo")]
public class User
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public long UserId { get; set; }
    public string FirstName { get; set; } = "John";
    public string LastName { get; set; } = "Doe";
    public string PasswordHash { get; set; } = "Invalid";
}
