using Microsoft.AspNetCore.Mvc;

namespace FamTreeApi.Controllers;

[ApiController]
[ApiExplorerSettings(IgnoreApi = true)]
[Route("/")]
public class HomeController : Controller
{
    [HttpGet]
    [Route("/")]
    public IActionResult Index()
    {
        return View("/Views/Home.cshtml");
    }
}