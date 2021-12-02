using Microsoft.AspNetCore.Mvc;

namespace ControleBovideoSquadFrontEnd.Controllers
{
    public class VendaController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}