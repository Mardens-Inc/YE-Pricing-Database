using Microsoft.AspNetCore.Mvc;

namespace api.Controllers;

[ApiController, Route("/api/status"), Produces("application/json")]
public class StatusController : ControllerBase
{
    [HttpGet]
    public object Get()
    {
        return new { status = "Okay" };
    }
}