using Citolab.Examenkompas.Backend.Helpers;
using Citolab.Examenkompas.Models;
using Citolab.Examenkompas.Seeder;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Collections.Generic;
using System.Linq;

namespace UnitTest
{
    [TestClass]
    public class UnitTest1
    {
        [TestMethod]
        public void GradeCorrect1()
        {
            //arrange
            const int maxScore = 20;
            const int actualScore = 12;
            const double nTerm = .05;

            //act
            var grade = ScoreHelper.GetGradeCvteWithNterm(maxScore, nTerm, actualScore);
            //assert

            Assert.AreEqual(5.5, grade);
        }

        [TestMethod]
        public void GradeCorrect2()
        {
            //arrange
            const int maxScore = 20;
            const int actualScore = 12;
            const double cesuur = 12;

            //act
            var grade = ScoreHelper.GetGradeCvteWithCesuur(maxScore, cesuur, actualScore);
            //assert

            Assert.AreEqual(5.5, grade);
        }

        [TestMethod]
        public void GradeCorrect_VWO_scheikunde_tijdvak_1_2017(){
            //arrange
            const int maxScore = 67;
            const int actualScore = 43;
            const double nTerm = 1.6;

            //act
            var grade = ScoreHelper.GetGradeCvteWithNterm(maxScore, nTerm, actualScore);
            //assert

            Assert.AreEqual(7.4, grade);
        }

        [TestMethod]
        public void DomeinScoreTest()
        {
            var examenId = 12345;
            var scores = new Examenscores
            {
                ExamenId = examenId,
                Scores = new List<ItemScore>
                {
                    new ItemScore { Volgnummer = 1, Score = 0 },
                    new ItemScore { Volgnummer = 2, Score = 1 },
                    new ItemScore { Volgnummer = 3, Score = 1 },
                    new ItemScore { Volgnummer = 4, Score = 1 },
                    new ItemScore { Volgnummer = 5, Score = 0 },
                }
            };
            var examen = new ExamenAnalysisMetadata()
            {
                ExamenId = examenId,
                Opgaven = new List<Opgave>() { new Opgave()
                    {
                        Items = new List<ItemInfo>
                        {
                            new ItemInfo { Volgnummer = 1 , Maxscore = 1 },
                            new ItemInfo { Volgnummer = 2 , Maxscore = 1 },
                            new ItemInfo { Volgnummer = 3 , Maxscore = 1 },
                            new ItemInfo { Volgnummer = 4 , Maxscore = 1 },
                            new ItemInfo { Volgnummer = 5 , Maxscore = 1 }
                        }
                    }},
                Examenonderdelen = new List<Examenonderdeel>
                {
                    new Examenonderdeel {
                        ItemVolgnummers = new List<int> { 1, 2, 3 },
                        Naam = "Domein 1",
                        GemiddeldeScore = 1,
                        MaxScore = 3,
                        SdScore = 0,
                        Type =ExamenonderdeelType.Domein
                    },
                    new Examenonderdeel {
                        ItemVolgnummers = new List<int> { 3, 4, 5 },
                        Naam = "Domein 2",
                        GemiddeldeScore = 2,
                        MaxScore = 3,
                        SdScore = 0,
                         Type =ExamenonderdeelType.Domein
                    }
                }
            };
            var result = examen.PercentageGoedPerDomein(scores);

            var domein1 = result.FirstOrDefault(r => r.Domein.Titel == "Domein 1");
            Assert.IsTrue(domein1.PercentageGoed == 0.67);
            Assert.IsTrue(domein1.PercentageGoedPopulatieHoog == 0.33);
            Assert.IsTrue(domein1.PercentageGoedPopulatieLaag == 0.33);
            var domein2 = result.FirstOrDefault(r => r.Domein.Titel == "Domein 2");
            Assert.IsTrue(domein2.PercentageGoed == 0.67);
            Assert.IsTrue(domein2.PercentageGoedPopulatieHoog == 0.67);
            Assert.IsTrue(domein2.PercentageGoedPopulatieLaag == 0.67);
        }

        [TestMethod]
        public void DomeinScorePolytoomTest()
        {
            var examenId = 12345;
            var scores = new Examenscores
            {
                ExamenId = examenId,
                Scores = new List<ItemScore>
                {
                    new ItemScore { Volgnummer = 1, Score = 4 },
                    new ItemScore { Volgnummer = 2, Score = 5 },
                    new ItemScore { Volgnummer = 3, Score = 2 },
                    new ItemScore { Volgnummer = 4, Score = 1 },
                    new ItemScore { Volgnummer = 5, Score = 0 },
                }
            };
            var examen = new ExamenAnalysisMetadata()
            {
                ExamenId = examenId,
                Opgaven = new List<Opgave>() { new Opgave()
                    {
                        Items = new List<ItemInfo>
                        {
                            new ItemInfo { Volgnummer = 1 , Maxscore = 4},
                            new ItemInfo { Volgnummer = 2 , Maxscore = 10 },
                            new ItemInfo { Volgnummer = 3 , Maxscore = 4},
                            new ItemInfo { Volgnummer = 4 , Maxscore = 4 },
                            new ItemInfo { Volgnummer = 5 , Maxscore = 2 }
                        }
                    }
                },
                Examenonderdelen = new List<Examenonderdeel>
                {
                    new Examenonderdeel
                    {
                        ItemVolgnummers = new List<int> { 1, 2, 3 },
                        Naam = "Domein 1",
                        GemiddeldeScore = 6,
                        MaxScore = 18,
                        Type = ExamenonderdeelType.Domein,
                        SdScore = 0
                    },
                    new Examenonderdeel
                    {
                        ItemVolgnummers = new List<int> { 3, 4, 5 },
                        Naam = "Domein 2",
                        GemiddeldeScore = 8,
                        MaxScore = 10,
                        Type = ExamenonderdeelType.Domein,
                        SdScore = 0
                    }
                }
            };
            var result = examen.PercentageGoedPerDomein(scores);

            var domein1 = result.FirstOrDefault(r => r.Domein.Titel == "Domein 1");
            Assert.IsTrue(domein1.PercentageGoed == 0.61);
            Assert.IsTrue(domein1.PercentageGoedPopulatieHoog == 0.33);
            Assert.IsTrue(domein1.PercentageGoedPopulatieLaag == 0.33);
            var domein2 = result.FirstOrDefault(r => r.Domein.Titel == "Domein 2");
            Assert.IsTrue(domein2.PercentageGoed == 0.3);
            Assert.IsTrue(domein2.PercentageGoedPopulatieLaag == 0.8);
            Assert.IsTrue(domein2.PercentageGoedPopulatieHoog == 0.8);
        }
    }
}
