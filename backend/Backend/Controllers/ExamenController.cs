using Citolab.Examenkompas.Backend.Helpers;
using Citolab.Examenkompas.Models;
using Citolab.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ReturnTrue.AspNetCore.Identity.Anonymous;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Citolab.Examenkompas.Backend.Controllers
{
    [Route("api/[controller]")]
    public class ExamenController : Controller
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ExamenController(IUnitOfWork unitOfWork, IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
            _unitOfWork = unitOfWork;
        }

        [HttpGet("test")]
        public ActionResult<Guid> Test()
        {
            return Ok(_httpContextAccessor.GetUserId());
        }

        [HttpGet("{id}/scores")]
        public async Task<ActionResult<Examenscores>> GetScoresAsync(int id)
        {
            var userId = _httpContextAccessor.GetUserId();
            var collection = _unitOfWork.GetCollection<Examenscores>();
            var latestScores = collection.AsQueryable().FirstOrDefault(s => s.Key == $"{id}|{userId}");
            if (latestScores == null)
            {
                var examenScore = new Examenscores
                {
                    CreatedByUserId = userId,
                    Key = $"{id}|{userId}",
                    Scores = new System.Collections.Generic.List<ItemScore>(),
                    Submitted = false
                };
                latestScores = await collection.AddAsync(examenScore);
            }
            return Ok(latestScores);
        }

        //[HttpGet("{id}/report")]
        //public async Task<ActionResult<Examenscores>> GetReportAsync(int id)
        //{
        //    var examen = await _unitOfWork.GetCollection<ExamenAnalysisMetadata>()
        //        .FirstOrDefaultAsync(examen => examen.ExamenId == id);
        //    var userId = _httpContextAccessor.GetUserId();
        //    var collection = _unitOfWork.GetCollection<Examenscores>();
        //    var alleScores = collection.AsQueryable().Where(c => c.CreatedByUserId == userId &&
        //    c.ExamenId == id && c.Submitted == true)
        //         .ToList();
        //    if (alleScores.Any())
        //    {
        //        var latestScores = alleScores.OrderByDescending(a => a.Created).FirstOrDefault();
        //        return Ok(GetReport(examen, latestScores));
        //    }
        //    else
        //    {
        //        return Ok();
        //    }
        //}

        [HttpPost("scores")]
        public async Task<ActionResult<ExamenReport>> SubmitScoresAsync([FromBody] Examenscores examenScore)
        {
            var scoreCollection = _unitOfWork.GetCollection<Examenscores>();
            examenScore.CreatedByUserId = _httpContextAccessor.GetUserId();
            ExamenAnalysisMetadata examen = null;
            if (examenScore.Submitted)
            {
                examen = _unitOfWork.GetCollection<ExamenAnalysisMetadata>()
                    .AsQueryable()
                    .FirstOrDefault(examen => examen.ExamenId == examenScore.ExamenId);
                var maxScoreByVolgnummer = examen.Opgaven
                    .SelectMany(o => o.Items)
                    .ToDictionary(i => i.Volgnummer, i => i.Maxscore);
                if (examen == null)
                {
                    return NotFound();
                }

                // check if maxScores and volgnummers are valid for this exam.
                foreach (var score in examenScore.Scores)
                {
                    if (!maxScoreByVolgnummer.ContainsKey(score.Volgnummer))
                    {
                        return BadRequest("volgnummer niet bekend in examen");
                    }
                    var maxScore = maxScoreByVolgnummer[score.Volgnummer];
                    if (score.Score > maxScore)
                    {
                        return BadRequest("score kan niet hoger zijn dan de maxscore.");
                    }
                    if (score.Score < 0)
                    {
                        return BadRequest("score kan niet kleiner zijn dan 0");
                    }
                }
            }
            examenScore.Key = $"{examenScore.ExamenId}|{examenScore.CreatedByUserId}";
            if (examenScore.Id == Guid.Empty || (await scoreCollection.GetAsync(examenScore.Id)) == null)
            {
                await scoreCollection.AddAsync(examenScore);
            }
            else
            {
                await scoreCollection.UpdateAsync(examenScore);
            }
            if (examen != null)
            {
                return Ok(GetReport(examen, examenScore));
            }
            else
            {
                return Ok();
            }
        }

        private ExamenReport GetReport(ExamenAnalysisMetadata examen, Examenscores examenscores)
        {
            var domeinscores = examen.PercentageGoedPerDomein(examenscores);
            var eindcijfer = examen.BerekenCijfer(examenscores);

            return new ExamenReport
            {
                VolledigBeantwoord = !domeinscores.Any(d => !d.VolledigBeantwoord),
                EindCijfer = eindcijfer,
                Domeinscores = domeinscores
            };
        }
    }

}
