import React from 'react';

interface Props {
  icon?: 'chevron-down' | 'paper' | 'digital' | 'edit' | 'correct';
}

export const Icon = (props: Props) => {
  let d = '';
  switch (props.icon) {
    case 'chevron-down':
      d =
        'M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z';
      break;
    case 'correct':
      d =
        'M15 3H5C3.89 3 3 3.89 3 5V10.82C3.6 10.24 4.28 9.8 5 9.5V5H12V10.82C12.03 10.85 12.07 10.87 12.1 10.9C12.44 11.24 12.73 11.61 12.97 12H19V19H12.97C12.73 19.39 12.44 19.76 12.1 20.1C11.74 20.45 11.35 20.74 10.94 21H19C20.11 21 21 20.11 21 19V9L15 3M14 10V4.5L19.5 10H14M7.5 11C5 11 3 13 3 15.5C3 16.38 3.25 17.21 3.69 17.9L.61 21L2 22.39L5.12 19.32C5.81 19.75 6.63 20 7.5 20C10 20 12 18 12 15.5S10 11 7.5 11M7.5 18C6.12 18 5 16.88 5 15.5S6.12 13 7.5 13 10 14.12 10 15.5 8.88 18 7.5 18Z';
      break;
    case 'edit':
      d =
        'M18.13 12L19.39 10.74C19.83 10.3 20.39 10.06 21 10V9L15 3H5C3.89 3 3 3.89 3 5V19C3 20.1 3.89 21 5 21H11V19.13L11.13 19H5V5H12V12H18.13M14 4.5L19.5 10H14V4.5M19.13 13.83L21.17 15.87L15.04 22H13V19.96L19.13 13.83M22.85 14.19L21.87 15.17L19.83 13.13L20.81 12.15C21 11.95 21.33 11.95 21.53 12.15L22.85 13.47C23.05 13.67 23.05 14 22.85 14.19Z';
      break;
    case 'paper':
      d =
        'M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z';
      break;
    case 'digital':
      d =
        'M4,6H20V16H4M20,18A2,2 0 0,0 22,16V6C22,4.89 21.1,4 20,4H4C2.89,4 2,4.89 2,6V16A2,2 0 0,0 4,18H0V20H24V18H20Z';
      break;
  }
  return (
    <svg
      className={(props.icon ? 'w-5' : 'w-0') + ' h-5 ml-2 -mr-1'}
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <path fill="currentColor" d={d} clipRule="currentColor" />
    </svg>
  );
};

export default Icon;
