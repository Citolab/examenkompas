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
    <div className="relative inline-block text-left">
      <Menu>
        {({ open }) => (
          <>
            <span className="rounded-md shadow-sm">
              <Menu.Button className="inline-flex justify-center text-sm px-4 py-2 leading-none border rounded text-white border-white hover:border-transparent hover:text-purple-600 hover:bg-white mt-4 lg:mt-0 ml-2">
                <span>{props.text}</span>
              </Menu.Button>
            </span>

            <Transition
              show={open}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items
                static
                className="absolute right-0 w-56 mt-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none"
              >
                <div className="py-1">
                  {props.items.map((item) => (
                    <Menu.Item key={item.id}>
                      {({ active }) => (
                        <div
                          onClick={() => props.onClick(item.id)}
                          className={`${
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700'
                          } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}
                        >
                          {item.title}
                        </div>
                      )}
                    </Menu.Item>
                  ))}
                </div>
              </Menu.Items>
            </Transition>
          </>
        )}
      </Menu>
    </div>
  );
};

export default DropdownButton;
