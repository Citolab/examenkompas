import {
  alleOpleidingsniveauOmschrijvingen,
  Cluster,
  ClustersPerNiveau,
  groupBy,
  Item,
  omschrijvingNaarOpleidingsniveauEnLeerweg,
  OpleidingsniveauType,
  Examen,
  Vak,
} from '@examenkompas/data';

export const vakken = [
  {
    opleidingsniveau: OpleidingsniveauType.VO_VWO,
    clusters: [
      {
        cluster: 'Exacte vakken',
        vakken: [
          'wiskunde A',
          'wiskunde B',
          'wiskunde C',
          'natuurkunde',
          'scheikunde',
          'biologie',
        ].map((title, index) => ({
          id: 1024 + index,
          title,
        })),
      },
      {
        cluster: 'Maatschappijvakken',
        vakken: [
          'geschiedenis',
          'aardrijkskunde',
          'economie',
          'maatschappij­wetenschappen',
          'management en organisatie',
          'filosofie',
          'bedrijfseconomie',
        ].map((title, index) => ({
          id: 1100 + index,
          title,
        })),
      },
      {
        cluster: 'Talen',
        vakken: [
          'Nederlands',
          'Fries',
          'Engels',
          'Frans',
          'Duits',
          'Spaans',
          'Russisch',
          'Turks',
          'Arabisch',
          'Griekse taal en cultuur',
          'Latijnse taal en cultuur ',
        ].map((title, index) => ({
          id: 1200 + index,
          title,
        })),
      },
    ],
  },
];

export const items = [
  {
    id: 2691.0,
    opgave: 'Contrastmiddel voor MRI-scans',
    ItSeqNumber: 1.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 3.0,
  },
  {
    id: 2692.0,
    opgave: 'Contrastmiddel voor MRI-scans',
    ItSeqNumber: 2.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2693.0,
    opgave: 'Contrastmiddel voor MRI-scans',
    ItSeqNumber: 3.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2694.0,
    opgave: 'Contrastmiddel voor MRI-scans',
    ItSeqNumber: 4.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2695.0,
    opgave: 'Contrastmiddel voor MRI-scans',
    ItSeqNumber: 5.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 3.0,
  },
  {
    id: 2696.0,
    opgave: 'Contrastmiddel voor MRI-scans',
    ItSeqNumber: 6.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2697.0,
    opgave: 'Contrastmiddel voor MRI-scans',
    ItSeqNumber: 7.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2698.0,
    opgave: "'Drogen' van witte olieverf",
    ItSeqNumber: 8.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2699.0,
    opgave: "'Drogen' van witte olieverf",
    ItSeqNumber: 9.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2700.0,
    opgave: "'Drogen' van witte olieverf",
    ItSeqNumber: 10.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 3.0,
  },
  {
    id: 2701.0,
    opgave: "'Drogen' van witte olieverf",
    ItSeqNumber: 11.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2702.0,
    opgave: "'Drogen' van witte olieverf",
    ItSeqNumber: 12.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2703.0,
    opgave: "'Drogen' van witte olieverf",
    ItSeqNumber: 13.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2704.0,
    opgave: 'Alginaat',
    ItSeqNumber: 14.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2705.0,
    opgave: 'Alginaat',
    ItSeqNumber: 15.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 3.0,
  },
  {
    id: 2706.0,
    opgave: 'Alginaat',
    ItSeqNumber: 16.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2707.0,
    opgave: 'Alginaat',
    ItSeqNumber: 17.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 3.0,
  },
  {
    id: 2708.0,
    opgave: 'Bio P',
    ItSeqNumber: 18.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 1.0,
  },
  {
    id: 2709.0,
    opgave: 'Bio P',
    ItSeqNumber: 19.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2710.0,
    opgave: 'Bio P',
    ItSeqNumber: 20.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2711.0,
    opgave: 'Bio P',
    ItSeqNumber: 21.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2712.0,
    opgave: 'Bio P',
    ItSeqNumber: 22.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 3.0,
  },
  {
    id: 2713.0,
    opgave: 'Bio P',
    ItSeqNumber: 23.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2714.0,
    opgave: 'Stanyl(r)',
    ItSeqNumber: 24.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 3.0,
  },
  {
    id: 2715.0,
    opgave: 'Stanyl(r)',
    ItSeqNumber: 25.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2716.0,
    opgave: 'Stanyl(r)',
    ItSeqNumber: 26.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2717.0,
    opgave: 'Stanyl(r)',
    ItSeqNumber: 27.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2718.0,
    opgave: 'Stanyl(r)',
    ItSeqNumber: 28.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2719.0,
    opgave: 'Bruin worden van appels',
    ItSeqNumber: 29.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 1.0,
  },
  {
    id: 2720.0,
    opgave: 'Bruin worden van appels',
    ItSeqNumber: 30.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 3.0,
  },
  {
    id: 2721.0,
    opgave: 'Bruin worden van appels',
    ItSeqNumber: 31.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2722.0,
    opgave: 'Bruin worden van appels',
    ItSeqNumber: 32.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2723.0,
    opgave: 'Bruin worden van appels',
    ItSeqNumber: 33.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2724.0,
    opgave: 'Bruin worden van appels',
    ItSeqNumber: 34.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
  {
    id: 2725.0,
    opgave: 'Bruin worden van appels',
    ItSeqNumber: 35.0,
    ItemTypeNr: 1.0,
    MCKey: '',
    MaxScor: 2.0,
  },
].map((i) => ({
  ...i,
  id: i.id.toString(),
}));

export const clustersPerNiveau: ClustersPerNiveau[] =
  alleOpleidingsniveauOmschrijvingen.map((naam) => {
    const { opleidingsniveau } =
      omschrijvingNaarOpleidingsniveauEnLeerweg(naam);
    return {
      naam,
      clusters: vakken
        .find((v) => v.opleidingsniveau === opleidingsniveau)
        ?.clusters.map((c) => {
          return {
            naam: c.cluster,
            vakken: c.vakken.map((v) => {
              return {
                cluster: c.cluster,
                code: v.id.toString(),
                naam: v.title,
                leerweg: null,
                niveauomschrijving: naam,
              } as Vak;
            }),
          } as Cluster;
        }),
    } as ClustersPerNiveau;
  });

const opgaven = groupBy(items, (i) => i.opgave);

export const voorbeeldExamens: Examen[] = [
  {
    examenId: 1028,
    vakcode: '20714',
    vaknaam: 'Scheikunde 2017 tijdvak 1',
    jaar: 2017,
    opleidingsniveau: OpleidingsniveauType.VO_HAVO,
    tijdvak: 1,
    isPilot: false,
    domeinen: [],
    tekstboekje: '',
    uitwerkbijlage: '',
    correctievoorschrift:
      'https://www.examenblad.nl/examendocument/2019/cse-1/scheikunde-havo/correctievoorschrift/2019/havo/f=/HA-1028-a-19-1-c.pdf',
    opgavenboekje:
      'https://www.examenblad.nl/examendocument/2019/cse-1/scheikunde-havo/opgaven/2019/havo/f=/HA-1028-a-19-1-o.pdf',
    opgaven: opgaven.map((itemset) => {
      return {
        titel: itemset[0],
        items: Object.values(itemset[1]).map((item, index) => {
          return {
            titel: `${item.opgave}_${index + 1}`,
            aantalAlternatieven: item.ItSeqNumber,
            sleutel: item.MCKey,
            volgnummer: item.ItSeqNumber,
            maxscore: item.MaxScor,
          } as Item;
        }),
      };
    }),
  },
  {
    examenId: 1020,
    vakcode: '2075',
    vaknaam: 'Scheikunde 2017 tijdvak 2',
    jaar: 2017,
    domeinen: [],
    tekstboekje: '',
    opleidingsniveau: OpleidingsniveauType.VO_HAVO,
    tijdvak: 1,
    isPilot: true,
    uitwerkbijlage: 'https://www2.cito.nl/vo/ex2017/VW-0251-a-17-1-u.pdf',
    correctievoorschrift:
      'https://www.examenblad.nl/examendocument/2019/cse-1/scheikunde-havo/correctievoorschrift/2019/havo/f=/HA-1028-a-19-1-c.pdf',
    opgavenboekje:
      'https://www.examenblad.nl/examendocument/2019/cse-1/scheikunde-havo/opgaven/2019/havo/f=/HA-1028-a-19-1-o.pdf',
    opgaven: opgaven.map((itemset) => {
      return {
        titel: itemset[0],
        items: Object.values(itemset[1]).map((item, index) => {
          return {
            titel: `${item.opgave}_${index + 1}`,
            aantalAlternatieven: item.ItSeqNumber,
            sleutel: item.MCKey,
            volgnummer: item.ItSeqNumber,
            maxscore: item.MaxScor,
          } as Item;
        }),
      };
    }),
  },
];
