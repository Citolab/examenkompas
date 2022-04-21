using Citolab.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Citolab.Examenfeedback.Models
{
    public class UserAction: Model
    {
        public string Action { get; set; }
        public string Payload { get; set; }
    }
}
