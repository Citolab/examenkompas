import { OptionValue } from '@examenkompas/data';
import React from 'react';
import DropdownButton from './dropdown-button';
import Icon from './icon';

interface Props {
  items: OptionValue[];
  subItems: { ref: string; items: OptionValue[] }[];
  onClick?: (value: { itemId: string; subItemId?: string }) => void;
}

export function NavBar(props: Props) {
  return (
    <ul className="list-reset flex md:flex-none justify-left flex-1  items-center">
      {props.items.map((item) => {
        const subItems = props.subItems.find((s) => s.ref === item.id);
        return (
          <li className="mr-3" key={item.id}>
            <button
              onClick={() =>
                props.onClick ? props.onClick({ itemId: item.id }) : null
              }
              className="border-primary border-2 text-primary px-4 py-3 rounded-full font-header"
            >
              {item.title}
            </button>
          </li>
        );
      })}
    </ul>
  );
}
