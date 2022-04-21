import React from 'react';
import { ClusterVakken } from './cluster-vakken';
import { clustersPerNiveau } from './story-data';

export default {
  title: 'components/clustervakken',
  component: ClusterVakken,
};

const vwoClusters = clustersPerNiveau.find((c) => c.naam === 'VWO');

export const normal = () => (
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  <div>
    {vwoClusters.clusters.map((c) => {
      return <ClusterVakken key={c.naam} cluster={c} />;
    })}
  </div>
);
