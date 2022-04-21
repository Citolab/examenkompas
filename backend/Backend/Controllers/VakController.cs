using System;
using System.Collections.Generic;
using System.Linq;
using Citolab.Persistence;
using Citolab.Examenkompas.Models;
using Microsoft.AspNetCore.Mvc;

namespace Citolab.Examenkompas.Backend.Controllers
{
    /// <summary>
    /// Informatie over vakken en bijbehorende domeinen.
    /// </summary>
    [Route("api/[controller]")]
    public class VakController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;

        public VakController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }


        /// <summary>
        /// Return all available 'vakken' divided in 'clustered'
        /// </summary>
        /// <returns>List of '''clusters'</returns>
        [HttpGet("clustersperniveau")]
        [ResponseCache(Duration = 24 * 60 * 60)]
        public ActionResult<IEnumerable<ClustersPerNiveau>> GetClustersPerNiveau() =>
            Ok(_unitOfWork.GetCollection<ClustersPerNiveau>().AsQueryable().AsEnumerable());

        [HttpGet("{vakcode}/niveau/{niveauomschrijving}/examens")]
        [ResponseCache(Duration = 24 * 60 * 60)]
        public ActionResult<IEnumerable<Examen>> GetExamensByVakcode(string vakcode, string niveauomschrijving)
        {
            var niveauData = niveauomschrijving.GetOpleidingsniveauEnLeerweg();
            var examens = _unitOfWork.GetCollection<Examen>()
            .AsQueryable()
            .Where(t => t.Vakcode == vakcode)
            .ToList()
            .Where(t => t.Opleidingsniveau == niveauData.Opleidingsniveau &&
                t.Leerweg == niveauData.Leerweg);
            return Ok(examens);
        }
    }
}
