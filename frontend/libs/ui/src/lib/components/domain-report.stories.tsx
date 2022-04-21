import React from 'react';
import DomeinRapportage from './domain-report';
import {
  examen,
  niveau,
  report,
  vaknaam,
} from './domain-report-example-stories.data';

export default {
  title: 'components/domeinRapportage',
  component: DomeinRapportage,
};

export const normal = () => (
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  <DomeinRapportage
    vaknaam={vaknaam}
    niveau={niveau}
    report={report}
    examen={examen}
    loadingReport={false}
  ></DomeinRapportage>
);
