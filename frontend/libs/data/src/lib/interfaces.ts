import { LeerwegType, OpleidingsniveauType } from './enums';

export interface Model {
  id: string;
  createdByUserId: string;
  created: string;
  lastModified: string;
  lastModifiedByUserId: string;
}

export interface OptionValue {
  id: string;
  title: string;
  selected: boolean;
}

export interface Item {
  code: string;
  titel: string;
  volgnummer: number;
  maxscore: number;
  sleutel: string;
  domeinen: string[];
  aantalAlternatieven: number;
  calamiteit: boolean;
}

export interface Opgave {
  titel: string;
  items: Item[];
}

export interface Examen {
  examenId: number;
  tijdvak: number;
  opleidingsniveau: OpleidingsniveauType;
  leerweg?: LeerwegType;
  vakcode: string;
  vaknaam: string;
  jaar: number;
  isPilot: boolean;
  opgaven: Opgave[];
  opgavenboekje: string;
  correctievoorschrift: string;
  uitwerkbijlage: string;
  tekstboekje: string;
  domeinen: DomeinInfo[];
}

export interface DomeinInfo {
  titel: string;
  titelHtml: string;
}

export interface Vak {
  /// Viercijferige code van het vak, bijv. 1028 (scheikunde)
  code: string;
  /// Naam van het vak, bijv. Scheikunde.
  naam: string;
  /// Cluster: bijv. exact, maatschappij e.d.
  cluster: string;
  /// Niveaucode-v04.1 subset voor voortgezetonderwijs.
  opleidingsniveau: OpleidingsniveauType;
  /// Leerstroom-v02. leerstroom van toepassing bij Opleidingsniveau VO_VMBO
  leerweg: LeerwegType;
  /// Niveauomschrijving, bijv. VMBO Theoretische leerweg
  niveauomschrijving: string;
}

export interface Cluster {
  naam: string;
  vakken: Vak[];
}

export interface ClustersPerNiveau {
  naam: string;
  opleidingsniveau: OpleidingsniveauType;
  /// Leerstroom-v02. leerstroom van toepassing bij Opleidingsniveau VO_VMBO
  leerweg: LeerwegType;
  clusters: Cluster[];
}

export interface Domeinscores {
  domein: DomeinInfo;
  percentageGoed: number;
  percentageGoedPopulatieLaag: number;
  percentageGoedPopulatieHoog: number;
  voldoendeScorepunten: boolean;
  volledigBeantwoord: boolean;
}

export interface UserAction {
  action: string;
  payload: string;
}

export interface ExamenReport {
  volledigBeantwoord: boolean;
  eindCijfer: number;
  domeinscores: Domeinscores[];
}

export interface ItemScore {
  volgnummer: number;
  score: number;
}

export interface Examenscores {
  id: string;
  examenId: number;
  submitted: boolean;
  scores: ItemScore[];
}
