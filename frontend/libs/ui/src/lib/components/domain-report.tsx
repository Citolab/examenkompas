import * as React from 'react';
import { Examen, ExamenReport } from '@examenkompas/data';
import { DomeinIcon } from './domein-icon';
import { DomeinMeter } from './domein-meter';
import { domeinKleuren } from './domein-kleuren';
import CountUp from 'react-countup';
import { DomeinInfo } from './domein-info';
import { SpinningCompass } from './spinning-compass';
import ReactToPrint from 'react-to-print';

interface Props {
  report: ExamenReport;
  examen: Examen;
  vaknaam: string;
  niveau: string;
  loadingReport: boolean;
}

const wrapHtml = (__html: string) => ({ __html });

export const DomeinRapportage = React.forwardRef<HTMLDivElement, Props>(
  (props, ref) => {
    return (
      <div ref={ref} className="w-full p-4 md:px-12 mb-12">
        <div className="w-full flex flex-col md:flex-row md:items-center ml-9">
          <div className="text-gray-500 font-header">
            <h1 className="text-black font-semibold text-lg capitalize whitespace-nowrap">
              {props.vaknaam}
            </h1>
            <h2 className="text-gray-400 text-base mb-2 whitespace-nowrap">
              {props.niveau && props.niveau.replace('_', ' ').replace('-', '/')}{' '}
              | {props.examen.jaar} | Tijdvak {props.examen.tijdvak}
            </h2>
          </div>
          <div className="relative w-full flex justify-center md:justify-start md:px-8 my-8">
            <JeCijfer
              loading={props.loadingReport}
              eindCijfer={props.report?.eindCijfer}
              volledigBeantwoord={props.report?.volledigBeantwoord}
            ></JeCijfer>
          </div>
        </div>
        <div className="flex-1 h-100 ">
          <div className="flex flex-col mb-2">
            <div className="flex flex-col md:flex-row items-start pl-9">
              <p className="font-header">Onderwerpen</p>
              <div className="flex flex-col flex-1">
                <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between">
                  <div></div>
                  <div className="md:w-64">
                    <h2 className="font-header">Score</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {props.report?.domeinscores?.map((domeinscores) => {
            return (
              <div
                key={domeinscores.domein.titel}
                className="flex flex-col mb-6"
              >
                <div className="flex items-start">
                  <div className="mr-2">
                    <DomeinIcon
                      name={domeinscores.domein.titel}
                      kleur={
                        domeinKleuren[
                          props.examen.domeinen.findIndex(
                            (d) => d.titel === domeinscores.domein.titel
                          )
                        ]
                      }
                    ></DomeinIcon>
                  </div>
                  <div className="flex flex-col flex-1">
                    <div className="flex-1 flex flex-col md:flex-row md:items-start md:justify-between">
                      <div className="bg-white rounded flex-1 mr-12 flex items-center text-gray-500 whitespace-nowrap">
                        {domeinscores.domein.titelHtml.indexOf('<a') !== -1 &&
                        domeinscores.domein.titelHtml.indexOf('href') !== -1 ? (
                          <p
                            className="wikiwijslink mr-4"
                            dangerouslySetInnerHTML={wrapHtml(
                              domeinscores.domein.titelHtml
                            )}
                          ></p>
                        ) : (
                          <p className=" text-gray-900 mr-4">
                            {domeinscores.domein.titel}
                          </p>
                        )}
                        <div className="mt-1">
                          {!domeinscores.voldoendeScorepunten && (
                            <WarningIcon></WarningIcon>
                          )}
                        </div>
                      </div>

                      <div
                        className={`mt-1 mb-2 md:w-64 rounded-lg ${
                          !domeinscores.volledigBeantwoord && `onvolledig`
                        }`}
                      >
                        <DomeinMeter
                          loading={props.loadingReport}
                          domein={domeinscores}
                        ></DomeinMeter>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex-1 h-100">
          <div className="flex flex-col mb-2">
            <div className="flex items-start pl-9">
              <div className="flex flex-col">
                {props.report?.domeinscores?.find(
                  (domeinscores) => !domeinscores.voldoendeScorepunten
                ) && (
                  <p className="text-sm text-gray-400 flex items-start mb-3">
                    <WarningIcon></WarningIcon>
                    Of je dit onderwerp goed beheerst is niet met zekerheid te
                    zeggen, daarvoor had dit examen te weinig vragen over dit
                    onderwerp
                  </p>
                )}
                <DomeinInfo></DomeinInfo>
              </div>
              <RapportLegenda></RapportLegenda>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

export default DomeinRapportage;

export function VoldoendeScorePunten() {
  return (
    <span className="whitespace-nowrap inline-flex items-center justify-center px-2 py-1 mr-2 text-xs font-bold leading-none text-red-600 bg-red-100 rounded-full">
      &lt;
    </span>
  );
}
export function WarningIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-5 h-5 mr-1"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
      />
    </svg>
  );
}

function RapportLegenda(props) {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 flex flex-col md:flex-row md:items-center md:justify-between">
        <div></div>
        <div className="md:w-64">
          <p className="font-header mb-1">Legenda</p>
          <div className="flex w-full overflow-hidden h-6 text-xs rounded border-2 border-gray-200 shadow-sm justify-center">
            <div className="bg-indigo-100 text-secondary-DEFAULT-400 inline-block px-2 text-sm h-full whitespace-nowrap">
              = andere leerlingen
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JeCijfer(props: {
  eindCijfer: number;
  volledigBeantwoord: boolean;
  loading: boolean;
}) {
  return (
    <div
      className={`${
        !props.volledigBeantwoord && `onvolledig`
      } shadow-sm border-2 border-gray-200  p-6 rounded-2xl text-center flex flex-col items-center justify-center`}
    >
      <div className="text-gray-500">Je cijfer</div>

      <h1 className="text-gray-800 mt-1 font-semibold text-4xl mb-1 capitalize">
        {!props.loading ? (
          <CountUp
            start={0}
            end={props.eindCijfer}
            duration={2}
            delay={0.5}
            separator=" "
            decimals={1}
            decimal=","
          />
        ) : (
          // <span>?</span>
          <SpinningCompass></SpinningCompass>
        )}
      </h1>
    </div>
  );
}
