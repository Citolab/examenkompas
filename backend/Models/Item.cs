using Citolab.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Citolab.Examenkompas.Models
{
    public class Item : Model
    {
        public string Code { get; set; }
        public string Titel { get; set; }
        public int ExamenId { get; set; }
        public int Volgnummer { get; set; }
        public int MaxScore { get; set; }
        public string Sleutel { get; set;}
        public bool Calamiteit { get; set; }
        public int AantalAlternatieven { get; set; }
    }
}
