import * as React from 'react';
import { Cluster, sort } from '@examenkompas/data';

interface Props {
  onClick?: (id: string) => void;
  cluster: Cluster;
}

export const ClusterVakken = (props: Props) => {
  return (
    <>
      <div className="font-header text-lg mb-2 text-secondary-light">
        {props.cluster.naam}
      </div>
      <ul className="flex-grow">
        {sort(props.cluster.vakken, (v) => v.naam).map((vak) => {
          return (
            <li key={vak.naam + vak.code}>
              <button
                onClick={props.onClick ? () => props.onClick(vak.code) : null}
                className="bg-white p-1 rounded mt-1 cursor-pointer hover:bg-primary-light font-body whitespace-nowrap"
              >
                {vak.naam}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default ClusterVakken;
