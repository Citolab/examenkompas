import { getUnique } from '@examenkompas/data';
import { ExternalLink, NavHeader, SpinningCompass } from '@examenkompas/ui';
import { DocumentViewer } from 'react-documents';
import React, { useLayoutEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import store, { InitAction, SelectExamenAction } from './store';

export function VakPage() {
  const navigate = useNavigate();
  const { vakcode, niveau } = useParams<{ vakcode: string; niveau: string }>();
  const [state, setState] = useState(store.currentState());

  useLayoutEffect(() => {
    const subs = store.subscribe(setState);
    store.dispatch(new InitAction({ vakcode, niveau }));
    return () => subs.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state.loading) {
    return (
      <div className="p-4 md:p-12">
        <SpinningCompass></SpinningCompass>
        {` `} Even koers zoeken
      </div>
    );
  }
  return (
    <div className="h-screen flex">
      <div className="bg-gray-100 w-full md:max-w-sm p-4 relative">
        <div className="flex justify-start">
          <NavHeader link={`/overzicht/${niveau}`}></NavHeader>
          <div>
            <a href="/" className="font-header text-lg text-secondary-light">
              Examenkompas
            </a>
            <h1 className="text-black font-semibold text-2xl capitalize">
              {state.vaknaam}
            </h1>
            <h2 className="text-gray-400 font-bold mb-2">
              {niveau.replace('_', ' ').replace('-', '/')}
            </h2>
          </div>
        </div>

        <div className="pt-8">
          <div className="flex items-center">
            <div className="w-8 h-8  text-gray-400 p-1 rounded-full flex items-start justify-center">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <p className="font-header ml-2">Kies examen.</p>
          </div>
          <div className="px-4 ml-8">
            <p className="text-gray-500 font-body">
              Maak een van deze examens. Door je antwoorden later zelf te scoren
              kom je erachter welk cijfer je voor dit examen zou hebben gekregen
              en zie je een overzicht van welke onderwerpen je al goed beheerst
              en welke je nog kunt oefenen.
            </p>
            {getUnique(state.examens.map((e) => e.jaar)).map((jaar) => {
              return (
                <div key={jaar} className="font-body my-6">
                  <p className="text-secondary-light font-header">{jaar}</p>
                  {state.examens
                    .filter((e) => e.jaar === jaar)
                    .map((examen) => {
                      return (
                        <div key={examen.examenId}>
                          <div className="w-full flex justify-between">
                            <button
                              className={`text-primary font-header px-2 py-1 ml-2 ${
                                state.selectedExamen &&
                                state.selectedExamen.examenId ===
                                  examen.examenId
                                  ? 'bg-primary-light border-primary border-b focus:outline-none'
                                  : ''
                              }`}
                              onClick={() => {
                                store.dispatch(
                                  new SelectExamenAction({
                                    examenId: examen.examenId,
                                  })
                                );
                              }}
                            >
                              Tijdvak {examen.tijdvak}{' '}
                              <span className="text-primary font-body">
                                {examen.isPilot && ` | Pilot`}
                              </span>
                            </button>
                            <ExternalLink
                              name=""
                              link={examen.opgavenboekje}
                            ></ExternalLink>
                          </div>
                          {examen.isPilot && (
                            <p className="text-sm text-gray-500 ml-4">
                              Geen officieel examen geweest
                              <br />
                              kan gebruikt worden om te oefenen
                            </p>
                          )}
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>
        </div>

        {/* {state.selectedExamen && (
          <>
        <div className="flex items-center">
            <div className="w-10 h-10 bg-white text-primary p-2 rounded-full flex items-start justify-center">
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
          <div className="px-4 ml-8">
            <p className="font-body text-gray-600">
              Of een deel van het examen om te kijken welke onderwerpen je al beheerst.{' '}
              {state.selectedExamen.uitwerkbijlage && 'Gebruik ook de uitwerkbijlage'}
            </p>
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
          </div>
          </>
)} */}

        <button
          className="disabled:opacity-40 bottom-0 right-0 m-4 text-gray-50 bg-red-500 rounded-full py-3 px-6 background-transparent font-bold outline-none focus:outline-none"
          type="button"
          disabled={!state.selectedExamen}
          onClick={() =>
            navigate(
              `/vak/${vakcode}/${niveau}/examen/${state.selectedExamen.examenId}`
            )
          }
        >
          {state.selectedExamen
            ? `Maken en nakijken`
            : `Selecteer eerst een tijdvak`}
        </button>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {!state.selectedExamen && (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <EmptyState></EmptyState>
              <span className="text-gray-500 ml-4 text-lg inline-block pt-6">
                selecteer een examen
                <br />
                om in te zien
              </span>
            </div>
          </div>
        )}
        {state.selectedExamen && (
          <DocumentViewer
            url={state.selectedExamen.opgavenboekje}
          ></DocumentViewer>
        )}
      </div>
    </div>
  );
}
export default VakPage;

export function EmptyState() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="229.929"
      height="229.929"
      viewBox="0 0 229.929 229.929"
    >
      <g
        id="Group_262"
        data-name="Group 262"
        transform="translate(-529.276 -272.613)"
      >
        <rect
          id="Rectangle_1441"
          data-name="Rectangle 1441"
          width="155.169"
          height="170"
          rx="32"
          transform="translate(529.276 382.334) rotate(-45)"
          fill="#fff4f4"
        />
        <g id="Group_261" data-name="Group 261">
          <g
            id="Group_244"
            data-name="Group 244"
            transform="translate(565.392 372.083)"
          >
            <path
              id="Path_339"
              data-name="Path 339"
              d="M1287.992,843.883,1215.029,830.3a2.7,2.7,0,0,1-2.16-3.147l9.14-49.084a2.7,2.7,0,0,1,3.147-2.16l72.963,13.587a2.7,2.7,0,0,1,2.16,3.148l-9.14,49.084A2.7,2.7,0,0,1,1287.992,843.883Z"
              transform="translate(-1212.578 -770.813)"
              fill="#f7cc7f"
            />
            <path
              id="Path_340"
              data-name="Path 340"
              d="M1279.15,779.616l-22.209-4.136a2.7,2.7,0,0,1-2.16-3.147l1.391-7.469a2.7,2.7,0,0,1,3.147-2.159l22.209,4.136a2.7,2.7,0,0,1,2.159,3.147l-1.391,7.469A2.7,2.7,0,0,1,1279.15,779.616Z"
              transform="translate(-1238.467 -762.659)"
              fill="#f7cc7f"
            />
          </g>
          <g
            id="Group_253"
            data-name="Group 253"
            transform="matrix(0.848, -0.53, 0.53, 0.848, 620.156, 388.27)"
          >
            <g id="Group_251" data-name="Group 251">
              <path
                id="Path_353"
                data-name="Path 353"
                d="M2356.622,1262.9l-14.351-36.005a3.53,3.53,0,0,1,1.972-4.587l51.642-20.584a3.53,3.53,0,0,1,4.586,1.972l14.351,36.005a3.531,3.531,0,0,1-1.972,4.587l-51.641,20.583A3.531,3.531,0,0,1,2356.622,1262.9Z"
                transform="translate(-2342.019 -1201.469)"
                fill="#86b1f2"
              />
              <path
                id="Path_354"
                data-name="Path 354"
                d="M2486.694,1253.17l-12.9-32.354a1.013,1.013,0,0,1,.566-1.317h0a1.013,1.013,0,0,1,1.316.566l12.9,32.354a1.013,1.013,0,0,1-.566,1.316h0A1.013,1.013,0,0,1,2486.694,1253.17Z"
                transform="translate(-2423.375 -1212.562)"
                fill="#466eb6"
              />
              <path
                id="Path_355"
                data-name="Path 355"
                d="M2474.35,1251.379l-10.588-26.564a1.013,1.013,0,0,1,.566-1.316h0a1.013,1.013,0,0,1,1.316.566l10.587,26.564a1.013,1.013,0,0,1-.565,1.315h0A1.013,1.013,0,0,1,2474.35,1251.379Z"
                transform="translate(-2417.177 -1215.033)"
                fill="#466eb6"
              />
              <path
                id="Path_356"
                data-name="Path 356"
                d="M2466.624,1261.17l-12.9-32.354a1.013,1.013,0,0,1,.566-1.316h0a1.013,1.013,0,0,1,1.316.566l12.9,32.354a1.013,1.013,0,0,1-.566,1.316h0A1.013,1.013,0,0,1,2466.624,1261.17Z"
                transform="translate(-2410.978 -1217.504)"
                fill="#466eb6"
              />
              <path
                id="Path_357"
                data-name="Path 357"
                d="M2453.646,1257.787l-9.953-24.971a1.012,1.012,0,0,1,.566-1.316h0a1.013,1.013,0,0,1,1.316.566l9.954,24.971a1.013,1.013,0,0,1-.566,1.316h0A1.013,1.013,0,0,1,2453.646,1257.787Z"
                transform="translate(-2404.78 -1219.974)"
                fill="#466eb6"
              />
              <g
                id="Group_250"
                data-name="Group 250"
                transform="translate(56.958 3.851)"
              >
                <path
                  id="Path_358"
                  data-name="Path 358"
                  d="M2497.024,1212.495l-.259-.651a.454.454,0,0,0-.582-.271l-4.9,1.953a.454.454,0,0,0-.236.6l.26.651a.454.454,0,0,0,.582.271l4.9-1.954A.454.454,0,0,0,2497.024,1212.495Z"
                  transform="translate(-2491.012 -1211.542)"
                  fill="#355389"
                />
                <path
                  id="Path_359"
                  data-name="Path 359"
                  d="M2499.931,1219.785l-.26-.651a.455.455,0,0,0-.582-.272l-4.9,1.954a.454.454,0,0,0-.235.6l.26.651a.453.453,0,0,0,.581.271l4.9-1.953A.455.455,0,0,0,2499.931,1219.785Z"
                  transform="translate(-2492.806 -1216.045)"
                  fill="#355389"
                />
                <path
                  id="Path_360"
                  data-name="Path 360"
                  d="M2502.835,1227.074l-.26-.651a.454.454,0,0,0-.581-.271l-4.9,1.954a.453.453,0,0,0-.235.6l.259.651a.454.454,0,0,0,.582.272l4.9-1.954A.455.455,0,0,0,2502.835,1227.074Z"
                  transform="translate(-2494.601 -1220.548)"
                  fill="#355389"
                />
                <path
                  id="Path_361"
                  data-name="Path 361"
                  d="M2505.741,1234.363l-.26-.651a.455.455,0,0,0-.582-.272l-4.9,1.954a.454.454,0,0,0-.235.6l.26.652a.454.454,0,0,0,.582.271l4.9-1.953A.454.454,0,0,0,2505.741,1234.363Z"
                  transform="translate(-2496.396 -1225.051)"
                  fill="#355389"
                />
                <path
                  id="Path_362"
                  data-name="Path 362"
                  d="M2508.646,1241.653l-.259-.651a.454.454,0,0,0-.582-.271l-4.9,1.954a.455.455,0,0,0-.236.6l.26.651a.455.455,0,0,0,.582.271l4.9-1.954A.454.454,0,0,0,2508.646,1241.653Z"
                  transform="translate(-2498.19 -1229.554)"
                  fill="#355389"
                />
                <path
                  id="Path_363"
                  data-name="Path 363"
                  d="M2511.552,1248.942l-.26-.651a.455.455,0,0,0-.582-.272l-4.9,1.954a.454.454,0,0,0-.236.6l.26.651a.454.454,0,0,0,.582.271l4.9-1.953A.455.455,0,0,0,2511.552,1248.942Z"
                  transform="translate(-2499.985 -1234.056)"
                  fill="#355389"
                />
                <path
                  id="Path_364"
                  data-name="Path 364"
                  d="M2514.458,1256.232l-.26-.651a.454.454,0,0,0-.582-.271l-4.9,1.953a.454.454,0,0,0-.235.6l.26.651a.454.454,0,0,0,.581.271l4.9-1.953A.454.454,0,0,0,2514.458,1256.232Z"
                  transform="translate(-2501.78 -1238.559)"
                  fill="#355389"
                />
                <path
                  id="Path_365"
                  data-name="Path 365"
                  d="M2517.362,1263.521l-.26-.652a.454.454,0,0,0-.581-.271l-4.9,1.954a.454.454,0,0,0-.236.6l.26.651a.454.454,0,0,0,.582.271l4.9-1.953A.454.454,0,0,0,2517.362,1263.521Z"
                  transform="translate(-2503.574 -1243.062)"
                  fill="#355389"
                />
                <path
                  id="Path_366"
                  data-name="Path 366"
                  d="M2520.269,1270.811l-.26-.651a.455.455,0,0,0-.582-.271l-4.9,1.953a.454.454,0,0,0-.235.6l.259.651a.454.454,0,0,0,.582.272l4.9-1.953A.454.454,0,0,0,2520.269,1270.811Z"
                  transform="translate(-2505.37 -1247.565)"
                  fill="#355389"
                />
                <path
                  id="Path_367"
                  data-name="Path 367"
                  d="M2523.174,1278.1l-.26-.651a.454.454,0,0,0-.582-.271l-4.9,1.953a.454.454,0,0,0-.236.6l.26.652a.454.454,0,0,0,.581.271l4.9-1.953A.455.455,0,0,0,2523.174,1278.1Z"
                  transform="translate(-2507.164 -1252.068)"
                  fill="#355389"
                />
                <path
                  id="Path_368"
                  data-name="Path 368"
                  d="M2526.079,1285.39l-.26-.652a.453.453,0,0,0-.581-.271l-4.9,1.953a.454.454,0,0,0-.235.6l.26.652a.454.454,0,0,0,.582.272l4.9-1.954A.454.454,0,0,0,2526.079,1285.39Z"
                  transform="translate(-2508.959 -1256.571)"
                  fill="#355389"
                />
                <path
                  id="Path_369"
                  data-name="Path 369"
                  d="M2528.985,1292.68l-.259-.651a.455.455,0,0,0-.582-.271l-4.9,1.954a.454.454,0,0,0-.235.6l.259.651a.454.454,0,0,0,.582.271l4.9-1.954A.454.454,0,0,0,2528.985,1292.68Z"
                  transform="translate(-2510.754 -1261.073)"
                  fill="#355389"
                />
              </g>
            </g>
            <g
              id="Group_252"
              data-name="Group 252"
              transform="matrix(0.848, -0.53, 0.53, 0.848, 5.868, -30.419)"
            >
              <path
                id="Path_370"
                data-name="Path 370"
                d="M2537.388,1286.164l-20.5,29.185a.782.782,0,0,0-.106.213l-2.089,6.413a.8.8,0,0,0,1.246.89l5.486-4.135a.8.8,0,0,0,.174-.18l20.548-29.26a.8.8,0,0,0-.225-1.138l-3.449-2.2A.8.8,0,0,0,2537.388,1286.164Z"
                transform="translate(-2514.655 -1285.823)"
                fill="#b75742"
              />
              <path
                id="Path_371"
                data-name="Path 371"
                d="M2521.805,1366.7l-.051.072-5.293,3.99-1.443-.966,1.98-6.078A24.672,24.672,0,0,1,2521.805,1366.7Z"
                transform="translate(-2514.879 -1333.937)"
                fill="#f7cc7f"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  );
}
