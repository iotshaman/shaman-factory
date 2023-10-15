using Microsoft.AspNetCore.Mvc;

namespace Shaman.CsharpServer.Controllers;

[ApiController]
public class HealthCheckController : ControllerBase
{
    [HttpGet("api/health")]
    public IActionResult Get()
    {
        return Ok(new { Status = "healthy" });
    }
}
