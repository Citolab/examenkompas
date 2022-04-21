import * as React from 'react';
import { Menu, Transition } from '@headlessui/react';
import { OptionValue } from '@examenkompas/data';

interface Props {
  onClick: (id: string) => void;
  text: string;
  items: OptionValue[];
}

export const DropdownButton = (props: Props) => {
  return (
    <div className="h-screen flex">
      <div className="bg-gray-600 w-64"></div>
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-scroll"></div>
      </div>
    </div>
  );
};

export default DropdownButton;
