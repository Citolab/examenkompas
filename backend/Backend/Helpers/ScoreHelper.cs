using Citolab.Examenkompas.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Citolab.Examenkompas.Backend.Helpers
{
    public static class ScoreHelper
    {
        /// <summary>
        /// Get the grade following the CVTE method.
        /// </summary>
        /// <param name="maxScore">maximum number of points attainable.</param>
        /// <param name="cesuur">number of points resulting in a 5.5 grade.</param>
        /// <param name="score">actual number of points awarded.</param>
        /// <returns></returns>
        public static double GetGradeCvteWithCesuur(int maxScore, double cesuur, int score)
        {
            var nTerm = 5.45 - (9 * (cesuur / maxScore));
            nTerm = Math.Round(nTerm, 1, MidpointRounding.AwayFromZero);
            return GetGradeCvteWithNterm(maxScore, nTerm, score);
        }
        
        /// <summary>
        /// Get the grade following the CVTE method.
        /// </summary>
        /// <param name="maxScore">maximum number of points attainable.</param>
        /// <param name="cesuur">number of points resulting in a 5.5 grade.</param>
        /// <param name="nTerm">the N-term</param>
        /// <param name="score">actual number of points awarded.</param>
        /// <returns></returns>
        public static double GetGradeCvteWithNterm(int maxScore, double nTerm, int score)
        {
            nTerm = Math.Round(nTerm, 1, MidpointRounding.AwayFromZero);
            var grade = (9 * (score / (double)maxScore)) + nTerm;

            if (nTerm > 1)
            {
                var s1 = maxScore * (nTerm - 1) / 9;
                var s2 = maxScore * (11 - 2 * nTerm) / 9;
                if (score < s1) grade = 18 * score / maxScore + 1;
                if (score > s2) grade = 4.5 * score / maxScore + 5.5;
            }

            if (nTerm < 1)
            {
                var s3 = maxScore * (2 - 2 * nTerm) / 9;
                var s4 = maxScore * (nTerm + 8) / 9;
                if (score < s3) grade = 4.5 * score / maxScore + 1;
                if (score > s4) grade = 18 * score / maxScore - 8;
            }

            if (grade >= 10)
            {
                return 10;
            }

            return Math.Round(grade, 1, MidpointRounding.AwayFromZero);
        }

        public static List<Domeinscores> GetDomeinPercentageGoed(Examen examen, List<Examenonderdeel> domeinen, Dictionary<int, int> maxScoreByVolgnummer, Dictionary<int, int> scoreByVolgnummer)
        {
            return domeinen.Select(domein =>
            {
                var volledigBeantwoord = !domein.ItemVolgnummers.Any(volgnummer => !scoreByVolgnummer.ContainsKey(volgnummer));
                
                var score = domein.ItemVolgnummers
                    .Where(vlgnr => scoreByVolgnummer.ContainsKey(vlgnr))
                    .Sum(vlgnr => scoreByVolgnummer[vlgnr]);

                var maxScore = domein.ItemVolgnummers
                    .Where(vlgnr => scoreByVolgnummer.ContainsKey(vlgnr))
                    .Sum(vlgnr => maxScoreByVolgnummer[vlgnr]);

                var percentageGoed = maxScore == 0 ? 0 : Math.Round((double)(score / (double)maxScore), 2);
                var percentageGoedPopulatieLaag = domein.MaxScore == 0 ? 0 : Math.Round((double)((domein.GemiddeldeScore - domein.SdScore) / (double)domein.MaxScore), 2);
                var percentageGoedPopulatieHoog = domein.MaxScore == 0 ? 0 : Math.Round((double)((domein.GemiddeldeScore + domein.SdScore) / (double)domein.MaxScore), 2);

                var domeinInfo = new DomeinInfo
                {
                    Titel = domein.Naam,
                    TitelHtml = domein.NaamHtml
                };
                return new Domeinscores
                {
                    Domein = domeinInfo,
                    PercentageGoed = percentageGoed,
                    PercentageGoedPopulatieLaag = percentageGoedPopulatieLaag,
                    PercentageGoedPopulatieHoog = percentageGoedPopulatieHoog,
                    VoldoendeScorepunten = domein.MaxScore >= 10,
                    VolledigBeantwoord = volledigBeantwoord
                };
        }).ToList();
        }
    }
}