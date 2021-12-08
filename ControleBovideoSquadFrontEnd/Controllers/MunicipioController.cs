using Microsoft.AspNetCore.Mvc;
//using Newtonsoft.Json;
using System.Net.Http.Headers;

namespace ControleBovideoSquadFrontEnd.Controllers
{
    public class MunicipioController : Controller
    {
        public async Task<IActionResult> Index()
        {           
            return View();
        }
    }
}
