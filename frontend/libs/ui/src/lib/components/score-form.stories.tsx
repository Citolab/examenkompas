import React from 'react';
import { ScoreForm } from './score-form';
import * as d from './story-data'; // this works, getting with { } './story-data' does not work somehow

export default {
  title: 'form/assessment',
  component: ScoreForm,
};

export const normal = () => {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const examens = d.voorbeeldExamens;
  return (
    <ScoreForm
      examen={examens[0]}
      submit={(e) => console.log(`submitted: ${JSON.stringify(e)}`)}
    />
  );
};
