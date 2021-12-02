using Microsoft.AspNetCore.Mvc;

namespace ControleBovideoSquadFrontEnd.Controllers
{
    public class AnimalController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
