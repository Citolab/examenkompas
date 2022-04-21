import { LeerwegType, OpleidingsniveauType } from './enums';

export const opleidingniveaus = new Map<OpleidingsniveauType, string>([
  [OpleidingsniveauType.VO_VMBO, 'VMBO'],
  [OpleidingsniveauType.VO_HAVO, 'HAVO'],
  [OpleidingsniveauType.VO_VWO, 'VWO'],
]);

export const leerwegen = new Map<LeerwegType, { abbr: string; title: string }>([
  [LeerwegType.VMBO_BB, { abbr: 'BB', title: 'Basisberoepsgerichte leerweg' }],
  [LeerwegType.VMBO_KB, { abbr: 'KB', title: 'Kaderberoepsgerichte leerweg' }],
  [
    LeerwegType.VMBO_GLGT,
    { abbr: 'GL-TL', title: 'Gemengde leerweg / Theoretische leerweg' },
  ],
]);

export const alleOpleidingsniveauOmschrijvingen = [
  opleidingniveaus.get(OpleidingsniveauType.VO_VWO),
  opleidingniveaus.get(OpleidingsniveauType.VO_HAVO),
  `${opleidingniveaus.get(OpleidingsniveauType.VO_VMBO)}_${
    leerwegen.get(LeerwegType.VMBO_GLGT).abbr
  }`,
  `${opleidingniveaus.get(OpleidingsniveauType.VO_VMBO)}_${
    leerwegen.get(LeerwegType.VMBO_KB).abbr
  }`,
  `${opleidingniveaus.get(OpleidingsniveauType.VO_VMBO)}_${
    leerwegen.get(LeerwegType.VMBO_BB).abbr
  }`,
];
