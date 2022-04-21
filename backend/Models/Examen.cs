using Citolab.Persistence;
using Citolab.Persistence.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Citolab.Examenkompas.Models
{
    public class Examen : Model
    {
        [EnsureIndex]
        public int ExamenId { get; set; }
        public int Tijdvak { get; set; }
        public Opleidingsniveau Opleidingsniveau { get; set; }
        public Leerweg? Leerweg { get; set; }
        public string Vakcode { get; set; }
        public double NTerm { get; set; }
        public string Vaknaam { get; set; }
        public bool IsPilot { get; set; }
        public int Jaar { get; set; }
        public string Opgavenboekje { get; set; }
        public int AantalItems { get; set; }
        public string Correctievoorschrift { get; set; }
        public string Uitwerkbijlage { get; set; }
        public string Tekstboekje { get; set; }
        public List<Opgave> Opgaven { get; set; }
        public List<DomeinInfo> Domeinen { get; set; }
    }

    public class DomeinInfo
    {
        public string Titel { get; set; }
        public string TitelHtml { get; set; }
    }

    public class Opgave
    {
        public string Titel { get; set; }
        public List<ItemInfo> Items { get; set; }
    }

    public class ItemInfo
    {
        public string Code { get; set; }
        public string Titel { get; set; }
        public int Volgnummer { get; set; }
        public int Maxscore { get; set; }
        public string Sleutel { get; set; }
        public int AantalAlternatieven { get; set; }
        public bool Calamiteit { get; set; }
        public List<string> Domeinen { get; set; }
    }
}