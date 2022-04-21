using Citolab.Persistence;
using System.Collections.Generic;

namespace Citolab.Examenkompas.Models
{
    public class ClustersPerNiveau : Model
    {
        public string Naam { get { return Opleidingsniveau.OpleidingsniveauOmschrijving(Leerweg); } }
        public Opleidingsniveau Opleidingsniveau { get; set; }
        public Leerweg? Leerweg { get; set; }
        public List<Cluster> Clusters { get; set; }
    }

    public class Cluster
    {
        public string Naam { get; set; }
        public List<VakInfo> Vakken { get; set; }
    }

    public class VakInfo
    {
        /// <summary>
        /// Viercijferige code van het vak, bijv. 1028 (scheikunde)
        /// </summary>
        public string Code { get; set; }
        /// <summary>
        /// Naam van het vak, bijv. Scheikunde.
        /// </summary>
        public string Naam { get; set; }

    }
}
