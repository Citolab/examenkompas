import { Examen, groupBy, OptionValue } from '@examenkompas/data';
import React from 'react';
import { DropdownButton } from './dropdown-button';

export default {
  title: 'components/dropdownbutton',
  component: DropdownButton,
};
const item = ['TL', 'GT', 'KB', 'BB'].map((v) => {
  return {
    id: v,
    title: v,
    selected: false,
  };
}) as OptionValue[];

export const normal = () => (
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  <DropdownButton
    text="VMBO"
    items={item}
    onClick={(value) => console.log(JSON.stringify(value))}
  />
);
