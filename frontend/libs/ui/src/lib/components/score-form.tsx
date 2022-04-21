import React, { useEffect, useRef, useState } from 'react';
import { Examen, Item, selectMany } from '@examenkompas/data';
import { Formik, Form, Field } from 'formik';
import { DomeinIcon } from './domein-icon';
import { domeinKleuren } from './domein-kleuren';

interface Props {
  examen: Examen;
  scores: Map<number, number>;
  changed?: (
    changedValue: { itemIdentifier: string; score: number },
    values: Map<number, number>
  ) => void;
  submit?: (values: Map<number, number>) => void;
}
export const ScoreForm = (props: Props) => {
  const [showDomain, setShowDomain] = useState(false);

  const formRef = useRef();
  const setTextInputRef = useRef<(element: HTMLInputElement) => void>();
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const items = selectMany(props.examen.opgaven, (opgave) =>
    opgave.items.map((item) => item)
  );

  // Unmount scroll wheel effect
  useEffect(() => {
    // Mount scroll wheel effect
    const blockWheelEvents = (e) => e.preventDefault();
    const textInputs = [];
    setTextInputRef.current = (element) => {
      if (element) {
        if (
          !textInputs.find(
            (el) => el.getAttribute('id') === element.getAttribute('id')
          )
        ) {
          element.addEventListener('wheel', blockWheelEvents, {
            passive: false,
          });
          textInputs.push(element);
        }
      }
    };
    return () => {
      // Anything in here is fired on component unmount.
      textInputs.forEach((tx) =>
        tx.removeEventListener('wheel', blockWheelEvents)
      );
    };
  }, []);

  const itemScores = items.map((item) => ({
    volgnummer: item.volgnummer,
    score: !item.calamiteit
      ? props.scores.get(item.volgnummer) ?? ''
      : item.maxscore,
  }));
  const itemDict = new Map<number, Item>();
  items.forEach((item) => {
    itemDict.set(item.volgnummer, item);
  });
  // eslint-disable-next-line no-sequences
  const initialValue = itemScores.reduce(
    // eslint-disable-next-line no-sequences
    (acc, item) => ((acc[item.volgnummer] = item.score || 0), acc),
    {}
  );

  return (
    <Formik
      initialValues={initialValue}
      innerRef={formRef}
      onSubmit={(values) => {
        const scoresInMap = new Map<number, number>(
          Object.entries(values).map((value) => {
            return [
              +value[0],
              parseInt(value[1]?.toString()) > -1 ? +value[1] : 0,
            ];
          })
        );
        props.submit(scoresInMap);
      }}
    >
      {(formikProps) => (
        <Form
          className="w-full"
          onChange={async (e) => {
            await sleep(200);
            const form = formRef.current || { values: [] };
            const scoresInMap = new Map<number, number>(
              Object.entries(form.values).map((value) => {
                return [+value[0], parseInt(value[1]) > -1 ? +value[1] : 0];
              })
            );
            const valueChangedData = {
              itemIdentifier: `${props.examen.examenId}|${(
                e.target as HTMLInputElement
              ).id
                .toString()
                .replace('input-', '')}`,
              score:
                parseInt((e.target as HTMLInputElement).value) > -1
                  ? +(e.target as HTMLInputElement).value
                  : 0,
            };
            if (props.changed) {
              props.changed(valueChangedData, scoresInMap);
            }
          }}
        >
          {/* op medium scherm content rechts scrollbaar, op mobile scherm onder elkaar */}
          <div className="flex flex-wrap">
            <button
              type="submit"
              className="sticky top-3 ml-auto appearance-none block bg-primary text-white font-bold border rounded-full py-3 px-4 focus:outline-none"
            >
              Rapport bekijken
            </button>

            {props.examen.opgaven.map((opgave, index) => {
              return (
                <div key={index} className="mb-4 w-full">
                  {opgave.titel && (
                    <h2 className="font-header text-lg mb-2 text-secondary-light">
                      {opgave.titel}
                    </h2>
                  )}
                  <hr className="h-1 rounded-full w-2/3 bg-gray-200"></hr>
                  {opgave.items.map((item, i) => {
                    return (
                      <div
                        key={item.volgnummer}
                        className="flex my-4 items-center"
                      >
                        <div style={{ minWidth: '4rem' }}>
                          {item.volgnummer}.
                        </div>
                        <div className="">
                          <Field
                            id={'input-' + item.volgnummer}
                            min={0}
                            disabled={item.calamiteit}
                            max={item.maxscore}
                            required
                            name={`[${item.volgnummer}]`}
                            className="px-2 py-2 w-16 border-2 border-grey-800 shadow-sm placeholder-gray-500 rounded"
                            type="number"
                            maxLength={1}
                            innerRef={setTextInputRef.current}
                          />
                        </div>
                        <div className="text-gray-400 font-body ml-2 mr-5">
                          {item.maxscore}pt
                        </div>

                        <ul className="flex mr-4">
                          {item.domeinen.map((domein, index) => (
                            <li key={index} className="ml-1">
                              <DomeinIcon
                                name={domein}
                                kleur={
                                  domeinKleuren[
                                    props.examen.domeinen.findIndex((d) =>
                                      domein.startsWith(d.titel)
                                    )
                                  ]
                                }
                              ></DomeinIcon>
                            </li>
                          ))}
                        </ul>
                        {item.calamiteit && (
                          <div className="text-sm text-gray-400">
                            Met deze examenvraag was iets mis. Daarom krijg je
                            automatisch de maximale score.
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </Form>
      )}
    </Formik>
  );
};
