import React, { useContext, useLayoutEffect, useRef, useState } from 'react';
import {
  ContactUs,
  ExternalLink,
  NavHeader,
  ScoreForm,
  DomeinIcon,
  domeinKleuren,
  ModalDialog,
  DomeinRapportage,
  DomeinInfo,
  SpinningCompass,
} from '@examenkompas/ui';
import { useParams, useNavigate, UNSAFE_NavigationContext } from 'react-router-dom';
import store, {
  InitAction,
  SelectExamenAction,
  ScoreChangedAction,
  ShowReportAction,
} from './store';

import { useOverlayTriggerState } from '@react-stately/overlays';
import { OverlayProvider, OverlayContainer } from '@react-aria/overlays';
import { useReactToPrint } from 'react-to-print';
import { BrowserHistory } from 'history';

const wrapHtml = (__html: string) => ({ __html });

export function ExamenPage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { vakcode, niveau, examenId } = useParams<{
    examenId: string;
    niveau: string;
    vakcode: string;
  }>();
  const [state, setState] = useState(store.currentState());

  const navigation = useContext(UNSAFE_NavigationContext)
  .navigator as BrowserHistory;
  const navigate = useNavigate();
  const modalState = useOverlayTriggerState({});
  // const openButtonRef = React.useRef();
  const closeButtonRef = React.useRef();

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useLayoutEffect(() => {
    const subs = store.subscribe(setState);
    let historyUnregisterCallback = null;
    const openScore = (location: Location) => {
      if (location.pathname.includes('score')) {
        store.dispatch(new ShowReportAction());
        modalState.open();
      }
    };
    store.dispatch(new InitAction({ vakcode: vakcode, niveau })).then(() => {
      store
        .dispatch(new SelectExamenAction({ examenId: +examenId }))
        .then(() => {
          openScore(window.location);
          historyUnregisterCallback = navigation.listen((location) => {
            openScore(window.location);
          });
        });
    });
    return () => {
      subs?.unsubscribe();
      if (historyUnregisterCallback) {
        historyUnregisterCallback();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);
  if (!state.selectedExamenId || state.loading || !state.selectedExamen) {
    return (
      <div className="p-4 md:p-12">
        <SpinningCompass></SpinningCompass>
        {` `} Even koers zoeken
      </div>
    );
  }
  return (
    <>
      <div className="flex flex-col md:h-screen md:flex-row">
        <div className="bg-gray-100 md:w-1/2 p-4 relative sidebar">
          <div className="flex justify-start">
            <NavHeader link={`/vak/${vakcode}/${niveau}`}></NavHeader>
            <div>
              <a href="/" className="font-header text-lg text-secondary-light">
                Examenkompas
              </a>
              <h1 className="text-black font-semibold text-2xl capitalize">
                {state.vaknaam}
              </h1>
              <h2 className="text-gray-400 font-bold mb-2">
                {niveau.replace('_', ' ').replace('-', '/')} /{' '}
                {state.selectedExamen.jaar} / Tijdvak{' '}
                {state.selectedExamen.tijdvak}
              </h2>
            </div>
          </div>
          <div className="">
            <div className="flex items-center">
              <div className="w-10 h-10  text-gray-400 p-2 rounded-full flex items-start justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
              <p className="font-header ml-2">Maak examen</p>
            </div>
            <div className="px-4 ml-8 mb-2">
              {/* <p className="font-body text-gray-500">
              Gebruik het examen{' '}
              {state.selectedExamen.uitwerkbijlage && 'en de uitwerkbijlage'}
            </p> */}
              <ExternalLink
                name="Examen"
                link={state.selectedExamen.opgavenboekje}
              ></ExternalLink>
              {state.selectedExamen.uitwerkbijlage && (
                <ExternalLink
                  name="Uitwerkbijlage"
                  link={state.selectedExamen.uitwerkbijlage}
                ></ExternalLink>
              )}
              {state.selectedExamen.tekstboekje && (
                <ExternalLink
                  name="Tekstboek"
                  link={state.selectedExamen.tekstboekje}
                ></ExternalLink>
              )}
            </div>
            <div className="flex items-center mt-8">
              <div className="w-10 h-10  text-gray-400 p-2 rounded-full flex items-start justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>

              <p className="font-header ml-2">Kijk je antwoorden na</p>
            </div>
            <div className="px-4 ml-8">
              <p className="font-body text-gray-500">
                Gebruik het correctievoorschrift om te bepalen hoeveel punten je
                krijgt.
              </p>
              <ExternalLink
                name="Correctievoorschrift"
                link={state.selectedExamen.correctievoorschrift}
              ></ExternalLink>
            </div>
            <div className="flex items-center mt-8">
              <div className="w-10 h-10  text-gray-400 p-2 rounded-full flex items-start justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
              </div>
              <p className="font-header ml-2">Vul je scores in.</p>
            </div>{' '}
            <div className="px-4 ml-8">
              <span className="font-body text-gray-500">
                Door je scores in te vullen kunnen we berekenen welke
                onderwerpen je al goed beheerst en waar je nog aan kunt werken.
              </span>
            </div>
            <div className="flex items-center mt-8">
              <div className="w-10 h-10  text-gray-400 p-2 rounded-full flex items-start justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path fill="#fff" d="M12 14l9-5-9-5-9 5 9 5z" />
                  <path
                    fill="#fff"
                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                  />
                </svg>
              </div>
              <p className="font-header ml-2">Volledig ingevuld?</p>
            </div>
            <div className="px-4 ml-8">
              <span className="text-gray-500 font-body">
                Dan tonen we het cijfer wat je gehaald zou hebben als je in dat
                jaar examen had gedaan.
              </span>
            </div>
            <div className="mt-8">
              <ContactUs></ContactUs>
            </div>
          </div>
        </div>
        <div className="flex-1 h-100 w-full md:h-screen md:overflow-auto p-8">
          <ul className="mb-4">
            <p className="mb-1 font-header font-semibold">
              Onderwerpen behandeld in examen
            </p>
            <DomeinInfo></DomeinInfo>
            {state.selectedExamen.domeinen.map((domein, index) => (
              <li key={index} className="flex w-full items-center my-1">
                <DomeinIcon
                  name={domein.titel}
                  kleur={domeinKleuren[index]}
                ></DomeinIcon>
                {/* { JSON.stringify(domein)} */}
                {domein.titelHtml.indexOf('<a') !== -1 &&
                domein.titelHtml.indexOf('href') !== -1 ? (
                  <p
                    className="ml-2 text-sm wikiwijslink"
                    dangerouslySetInnerHTML={wrapHtml(domein.titelHtml)}
                  ></p>
                ) : (
                  <p className="ml-2 text-sm text-gray-500">{domein.titel}</p>
                )}

                {/* <DomeinInfo domein={domein}></DomeinInfo> */}
              </li>
            ))}
          </ul>
          <p className="mb-1 font-header font-semibold mt-6">
            Jouw examen scores
          </p>

          <ScoreForm
            scores={state.scores}
            examen={state.selectedExamen}
            changed={(changedValue, values) => {
              store.dispatch(new ScoreChangedAction({ changedValue, values }));
            }}
            submit={(_) => {
              // modalState.open();
              navigate(
                `/vak/${vakcode}/${niveau}/examen/${state.selectedExamen.examenId}/score`
              );
            }}
          />
        </div>
      </div>
      <OverlayProvider>
        {modalState.isOpen && (
          <OverlayContainer>
            <ModalDialog
              title="Rapport"
              isOpen
              onClose={() => {
                modalState.close();
                navigate(
                  `/vak/${vakcode}/${niveau}/examen/${state.selectedExamen.examenId}`
                );
              }}
              isDismissable
              button={
                <button
                  className="flex items-center mr-2 text-primary bg-white border-2 border-primary rounded-full py-2 px-4 text-lg font-semibold"
                  onClick={handlePrint}
                >
                  Printen
                </button>
              }
            >
              <div className="w-full flex-1">
                <DomeinRapportage
                  ref={componentRef}
                  loadingReport={state.loadingReport}
                  vaknaam={state.vaknaam}
                  niveau={niveau}
                  report={state.report}
                  examen={state.selectedExamen}
                ></DomeinRapportage>
              </div>
            </ModalDialog>
          </OverlayContainer>
        )}
      </OverlayProvider>
    </>
  );
}
export default ExamenPage;
