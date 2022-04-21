import {
  opleidingniveaus,
  OptionValue,
  OpleidingsniveauType,
  leerwegen,
} from '@examenkompas/data';
import React from 'react';
import { NavBar } from './navbar';

export default {
  title: 'components/navbar',
  component: NavBar,
};

const items: OptionValue[] = Array.from(opleidingniveaus.entries()).map(
  (v) => ({
    id: v[0].toString(),
    title: v[1],
    selected: false,
  })
);
const subItems = [
  {
    ref: OpleidingsniveauType.VO_VMBO.toString(),
    items: Array.from(leerwegen.entries()).map((v) => ({
      id: v[0].toString(),
      title: v[1].abbr,
      selected: false,
    })),
  },
];

export const normal = () => (
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  <NavBar items={items} subItems={subItems} />
);
