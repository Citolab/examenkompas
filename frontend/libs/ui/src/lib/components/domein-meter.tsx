import { Domeinscores } from '@examenkompas/data';
import * as React from 'react';
import { useEffect } from 'react';

export function DomeinMeter(props: { domein: Domeinscores; loading: boolean }) {
  const [pGoed, setpGoed] = React.useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setpGoed(props.domein.percentageGoed);
    }, 500);
    return () => {
      // Return callback to run on unmount.
      clearInterval(timer);
    };
  }, [props.domein.percentageGoed]);

  return props.loading ? null : (
    <div className=" relative w-full overflow-hidden h-6 text-xs rounded border-2 border-gray-200 shadow-sm">
      <div
        style={{
          marginLeft: props.domein.percentageGoedPopulatieLaag * 100 + '%',
          width:
            (props.domein.percentageGoedPopulatieHoog -
              props.domein.percentageGoedPopulatieLaag) *
              100 +
            '%',
        }}
        className="absolute h-full p-px bg-indigo-100"
      ></div>
      <div
        style={{
          width: '3px',
          left: pGoed * 100 - 1 + '%',
          transition: 'all 1s ease-out 0s',
        }}
        className="absolute h-full bg-black"
      >
        <span className="text-sm -ml-8 text-black">
          {Math.round(pGoed * 100)}%
        </span>
      </div>
    </div>
  );
}
