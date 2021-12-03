using ControleBovideoSquad.CrossCutting.Dto.Propriedade;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ControleBovideoSquadFrontEnd.Controllers
{
    public class PropriedadeController : Controller
    {
        public ActionResult Index()
        {
            var Model = new PropriedadeDto();
            return View();
        }
    }
}
