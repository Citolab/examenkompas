import { LeerwegType, OpleidingsniveauType } from './enums';
import {
  ClustersPerNiveau,
  Vak,
  OptionValue,
  Examen,
  UserAction,
} from './interfaces';
import { AxiosInstance } from 'axios';
import { leerwegen, opleidingniveaus } from './static';
/* eslint-disable @typescript-eslint/no-explicit-any */
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

export function getUnique<T>(arr: T[]): T[] {
  return arr.filter(onlyUnique);
}

export function sort<T, K>(list: T[], getKey: (item: T) => K, desc = false) {
  list.sort((a: T, b: T) => {
    const valueA = getKey(a);
    const valueB = getKey(b);
    if (valueA < valueB) {
      return !desc ? -1 : 1;
    } else if (valueA > valueB) {
      return !desc ? 1 : -1;
    } else {
      return 0;
    }
  });
  return list;
}

export function groupBy<T, K>(list: T[], getKey: (item: T) => K) {
  const map = new Map<K, T[]>();
  list.forEach((item) => {
    const key = getKey(item);
    const collection = map.get(key);
    if (!collection) {
      map.set(key, [item]);
    } else {
      collection.push(item);
    }
  });
  return Array.from(map);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function selectMany<T, K>(list: T[], getKey: (item: T) => K[]) {
  return list.map((x) => getKey(x)).reduce((a, b) => a.concat(b));
}

export const opleidingsniveauOmschrijving = (examen: Examen) => {
  //.leerweg en .opleidingsniveau
  const opleiding = opleidingniveaus.get(examen.opleidingsniveau);
  const leerweg = examen.leerweg ? leerwegen.get(examen.leerweg) : '';
  return `${opleiding}${leerweg ? `_${leerweg.abbr}` : ''}`;
};

export const omschrijvingNaarOpleidingsniveauEnLeerweg = (
  omschrijving: string
) => {
  const [opleidingsniveauValue, leerwegValue] = omschrijving.split('_');
  const opleidingsniveau = Array.from(opleidingniveaus.entries()).find((o) => {
    return o[1] === opleidingsniveauValue;
  })[0];
  const leerweg = leerwegValue
    ? Array.from(leerwegen.entries()).find((o) => {
        return o[1].abbr === leerwegValue;
      })[0]
    : null;
  return {
    opleidingsniveau,
    leerweg,
  };
};

export const opleidingsniveauLeerwegOmschrijving = (
  opleidingsniveau: OpleidingsniveauType,
  leerweg?: LeerwegType
) => {
  const opleiding = opleidingniveaus.get(opleidingsniveau);
  const leerwegValue = leerweg ? leerwegen.get(leerweg) : '';
  return `${opleiding}${leerwegValue ? `_${leerwegValue.abbr}` : ''}`;
};

export const randomNumber = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export function convertToOptionValues<T>(
  values: Array<T>,
  getId: (item: T) => string = (item) => item.toString(),
  getTitle: (item: T) => string = (item) => item.toString()
) {
  return values.map((v) => {
    return {
      id: getId(v),
      title: getTitle(v),
      selected: false,
    } as OptionValue;
  });
}

export function vakkenMetGecombineerdeNiveauClusterSleutel(
  clustersPerNiveau: ClustersPerNiveau[]
) {
  const m = new Map<string, Vak[]>();
  clustersPerNiveau.forEach((niveau) => {
    niveau?.clusters?.forEach((cluster) => {
      m.set(`${niveau.naam}_${cluster.naam}`, cluster.vakken);
    });
  });
  return m;
}

export const log = (
  userAction: UserAction,
  instance: AxiosInstance,
  useBackend = true
) => {
  if (useBackend) {
    instance.post(`/action`, userAction);
  } else {
    console.log(userAction);
  }
};
