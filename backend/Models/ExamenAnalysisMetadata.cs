using Citolab.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Citolab.Examenkompas.Models
{

    public class ExamenAnalysisMetadata : Examen
    {
        public List<Examenonderdeel> Examenonderdelen { get; set; } = new List<Examenonderdeel>();
        public int Schaallengte { get; set; }
        public ExamenAnalysisMetadata() { }
        public ExamenAnalysisMetadata(Examen examen)
        {
            Jaar = examen.Jaar;
            Opgaven = examen.Opgaven;
            ExamenId = examen.ExamenId;
            Vakcode = examen.Vakcode;
            Vaknaam = examen.Vaknaam;
            Leerweg = examen.Leerweg;
            Opgavenboekje = examen.Opgavenboekje;
            Correctievoorschrift = examen.Correctievoorschrift;
            Tekstboekje = examen.Tekstboekje;
            Opleidingsniveau = examen.Opleidingsniveau;
            NTerm = examen.NTerm;
            Tijdvak = examen.Tijdvak;
        }
    }

    public class Examenonderdeel
    {
        public string Naam { get; set; }
        public string NaamHtml { get; set; }
        public List<int> ItemVolgnummers { get; set; }
        // wordt niks mee gedaan, max score is score van alle gemaakte items in het domein
        public int? MaxScore { get; set; }
        public double? GemiddeldeScore { get; set; }
        public double? SdScore { get; set; }
        public int? K { get; set; }
        public ExamenonderdeelType Type { get; set; }
    }
}
