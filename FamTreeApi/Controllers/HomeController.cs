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
    [HttpGet]
    [Route("/input")]
    public IActionResult Input()
    {
        return View("/Views/InputTest.cshtml");
    }
}