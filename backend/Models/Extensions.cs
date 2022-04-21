using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Reflection;
using System.Linq;

namespace Citolab.Examenkompas.Models
{
    public static class Extensions
    {
        public static Leerweg? GetLeerweg(this string niveau)
        {
            switch (niveau.ToLower())
            {
                //gl en gt nemen dezelfde examens af. 
                // wordt nu als TL aangeduid. 
                case "tl":
                case "gt":
                case "vmbo theoretische leerweg":
                case "gl":
                case "vmbo gemengde leerweg":
                case "gl/tl":
                case "gl-tl":
                    return Leerweg.VMBO_GL_TL;
                case "bb":
                case "vmbo basisberoepsgerichte leerweg":
                    return Leerweg.VMBO_BB;
                case "kb":
                case "vmbo kaderberoepsgerichte leerweg":
                    return Leerweg.VMBO_KB;
                default: return null;
            }
        }
        public static Opleidingsniveau ConvertToOpleidingsniveau(this string niveau)
        {
            switch (niveau.ToLower())
            {
                case "havo":
                case "ha":
                    {
                        return Opleidingsniveau.VO_HAVO;
                    }
                case "vwo":
                case "vw":
                    { return Opleidingsniveau.VO_VWO; }
                case "vmbo":
                case "tl":
                case "gt":
                case "gl/tl":
                case "gl-tl":
                case "gl":
                case "bb":
                case "kb":
                    { return Opleidingsniveau.VO_VMBO; }

                default:
                    {
                        if (niveau.StartsWith("vmbo")) return Opleidingsniveau.VO_VMBO;
                        throw new Exception($"'{niveau}' kan niet worden vertaald naar opleidingsniveau");
                    }
            }
        }


        public static string OpleidingsniveauOmschrijving(this Opleidingsniveau niveau, Leerweg? leerweg)
        {
            return leerweg.HasValue ? $"{niveau.GetDescription()}_{leerweg.Value.GetDescription()}" :
             $"{niveau.GetDescription()}";
        }
        public static (Opleidingsniveau Opleidingsniveau, Leerweg? Leerweg) GetOpleidingsniveauEnLeerweg(this string omschrijving)
        {
            var omschrijvingArray = omschrijving.Split('_');
            var opleidingsniveau = omschrijvingArray[0].ConvertToOpleidingsniveau();
            Leerweg? leerweg = null;
            if (omschrijvingArray.Length > 1)
            {
                leerweg = omschrijvingArray[1].GetLeerweg();
            }
            return (opleidingsniveau, leerweg);
        }

        public static ClusterType GetClusterType(this string type)
        {
            switch (type.ToLower().Trim())
            {
                case "exact":
                    return ClusterType.Exact;
                case "maatschappij":
                    return ClusterType.Maatschappij;
                case "kunst":
                    return ClusterType.Kunst;
                case "talen":
                    return ClusterType.Taal;
                case "overige":
                    return ClusterType.Overige;
            }
            var clusterTypeDescriptions = new Dictionary<string, ClusterType>();
            foreach (ClusterType clusterType in Enum.GetValues(typeof(ClusterType)))
            {
                clusterTypeDescriptions.Add(clusterType.GetDescription().ToLower().Trim(), clusterType);
            }
            return clusterTypeDescriptions[type.Trim().ToLower()];
        }

        public static int? ParseToIntSafe(this string value)
        {
            if (int.TryParse(value, out var v))
            {
                return v;
            }
            return null;
        }

        public static double? ParseToDoubleSafe(this string value)
        {
            if (double.TryParse(value, out var v))
            {
                return v;
            }
            return null;
        }

        public static ExamenonderdeelType? GetExamenonderdeelType(this string type)
        {
            switch (type.ToLower().Trim())
            {
                case "examenonderdeel/thema":
                    return ExamenonderdeelType.Examenonderdeel;
                case "taxonomie":
                    return ExamenonderdeelType.Taxonomie;
                case "domein":
                    return ExamenonderdeelType.Domein;
                case "subdomein":
                    return ExamenonderdeelType.Subdomein;
                case "vraagtype":
                    return ExamenonderdeelType.Vraagtype;
            }
            return null;
        }

        public static string GetExamenNaam(this Examen examen)
        {
            return $"{examen.Opleidingsniveau.OpleidingsniveauOmschrijving(examen.Leerweg)}-{examen.Vaknaam}-{examen.Jaar}-tijdvak-{examen.Tijdvak}";
        }

        public static string GetDescription(this Enum value)
        {
            var fi = value.GetType().GetField(value.ToString());
            var attributes =
                (DescriptionAttribute[])fi.GetCustomAttributes(
                    typeof(DescriptionAttribute),
                    false);
            return attributes.Length > 0 ? attributes[0].Description : value.ToString();
        }

    }
}
