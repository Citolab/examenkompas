using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Citolab.Examenkompas.Models
{
    public class ExamenReport
    {
        public double EindCijfer { get; set; }
        public bool VolledigBeantwoord { get; set; }
        public List<Domeinscores> Domeinscores { get; set; }
    }

    public class Domeinscores
    {
        public DomeinInfo Domein { get; set; }
        public double PercentageGoed { get; set; }
        public double PercentageGoedPopulatieLaag { get; set; }
        public double PercentageGoedPopulatieHoog { get; set; }

        public bool VolledigBeantwoord { get; set; }
        public bool VoldoendeScorepunten { get; set; }
    }
}
