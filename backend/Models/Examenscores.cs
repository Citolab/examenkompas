using Citolab.Persistence;
using Citolab.Persistence.Helpers;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Citolab.Examenkompas.Models
{
    [Cache(300)]
    public class Examenscores : Model
    {
        public int ExamenId { get; set; }
        public bool Submitted { get; set; }
        public List<ItemScore> Scores { get; set; }
        
        [EnsureIndex]
        public string Key { get; set; }
    }

    public class ItemScore
    {
        public int Volgnummer { get; set; }
        public int Score { get; set; }
    }
}
