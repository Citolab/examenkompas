using System.ComponentModel;

namespace Citolab.Examenkompas.Models
{
    // ReSharper disable InconsistentNaming
    public enum Leerweg
    {
        [Description("BB")]
        // Basisberoepsgerichte leerweg
        VMBO_BB = 0, // Voorbereidend middelbaar beroepsonderwijs,basisberoepsgerichte leerweg            
        [Description("KB")]
        // Kaderberoepsgerichte leerweg
        VMBO_KB, // Voorbereidend middelbaar beroepsonderwijs, kaderberoepsgerichte leerweg
        // GL en GT samengevoegd.
        [Description("GL-TL")]
        // Gemengde leerweg/ theoretische leerweg
        VMBO_GL_TL, // Voorbereidend middelbaar beroepsonderwijs, gemengde leerweg
        // Voorbereidend middelbaar beroepsonderwijs, theoretische leerweg
    }
    public enum Opleidingsniveau // Niveaucode-v04.1 
    {
        [Description("VMBO")]
        VO_VMBO = 0, // Voorbereidend middelbaar beroepsonderwijs
        [Description("HAVO")]
        VO_HAVO, // Hoger algemeen voortgezet onderwijs
        [Description("VWO")]
        VO_VWO, // Voorbereidend wetenschappelijk onderwijs             
    }

    public enum Difficulty
    {
        Easy = 0,
        Average,
        Difficult
    }
    // ReSharper restore InconsistentNaming

    public enum ClusterType
    {
        [Description("Exacte vakken")]
        Exact = 0,
        [Description("Maatschappijvakken")]
        Maatschappij,
        [Description("Talen")]
        Taal,
        [Description("Kunst")]
        Kunst,
        [Description("Overige")]
        Overige
    }

    public enum ExamenonderdeelType
    {
        [Description("zonder compensatiescore")]
        Zonder_compensatie_score = 0,
        [Description("examenonderdeel/thema")]
        Examenonderdeel,
        [Description("domein")]
        Domein,
        [Description("subdomein")]
        Subdomein,
        [Description("vraagtype")]
        Vraagtype,
        [Description("overige")]
        Overige,
        [Description("taxonomie")]
        Taxonomie
    }
}
