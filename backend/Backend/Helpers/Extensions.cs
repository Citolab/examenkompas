using Citolab.Examenkompas.Models;
using Microsoft.AspNetCore.Http;
using ReturnTrue.AspNetCore.Identity.Anonymous;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace Citolab.Examenkompas.Backend.Helpers
{
    public static class Extensions
    {
        public static List<Domeinscores> PercentageGoedPerDomein(this ExamenAnalysisMetadata examen, Examenscores examenScore)
        {
            var domeinen = examen.Examenonderdelen
                .Where(e => e.Type == ExamenonderdeelType.Domein || e.Type == ExamenonderdeelType.Subdomein)
                .ToList();
            var scoreByVolgnummer = examenScore.Scores.ToDictionary(s => s.Volgnummer, s => s.Score);
            var maxScoreByVolgnummer = examen.Opgaven
                .SelectMany(o => o.Items)
                .ToDictionary(i => i.Volgnummer, i => i.Maxscore);
            return ScoreHelper.GetDomeinPercentageGoed(examen, domeinen, maxScoreByVolgnummer, scoreByVolgnummer);
        }

        public static double BerekenCijfer(this ExamenAnalysisMetadata examen, Examenscores examenScore)
        {
            var totalScore = examenScore.Scores.Sum(s => s.Score);
            return ScoreHelper.GetGradeCvteWithNterm(examen.Schaallengte, examen.NTerm, totalScore);
        }

        public static Guid GetUserId(this IHttpContextAccessor httpContextAccessor)
        {
            IAnonymousIdFeature feature = httpContextAccessor.HttpContext.Features.Get<IAnonymousIdFeature>();
            if (feature != null)
            {
                var anonymousId = Guid.Parse(feature.AnonymousId);
                return anonymousId;
            }
            return Guid.Empty;
        }
    }


}
