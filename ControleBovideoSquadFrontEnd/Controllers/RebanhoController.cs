using Microsoft.AspNetCore.Mvc;

namespace ControleBovideoSquadFrontEnd.Controllers
{
    public class RebanhoController : Controller
    {
        public IActionResult Index()
        {
            return View();  
        }
    }
}