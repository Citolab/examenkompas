import {
  opleidingniveaus,
  omschrijvingNaarOpleidingsniveauEnLeerweg,
  opleidingsniveauOmschrijving,
  sort,
  opleidingsniveauLeerwegOmschrijving,
} from '@examenkompas/data';
import React, { useLayoutEffect, useState } from 'react';
import {
  BackgroundImage,
  ClusterVakken,
  NavHeader,
  SpinningCompass,
} from '@examenkompas/ui';
import { useNavigate, useParams } from 'react-router-dom';
import store from './store';
import { InitAction } from './store';

const opleidingniveausOptions = Array.from(opleidingniveaus.entries()).map(
  (v) => ({
    type: v[0],
    title: v[1],
    selected: false,
  })
);

export const VakkenoverzichtPage = () => {
  const navigate = useNavigate();
  const { niveau } = useParams<{ niveau: string }>();
  const [state, setState] = useState(store.currentState());

  useLayoutEffect(() => {
    const opleidingsniveau = niveau
      ? omschrijvingNaarOpleidingsniveauEnLeerweg(niveau).opleidingsniveau
      : null;
    const subs = store.subscribe(setState);
    store.dispatch(new InitAction(opleidingsniveau));
    return () => subs.unsubscribe();
  }, [niveau]);

  return (
    <>
      <BackgroundImage></BackgroundImage>
      <div className="bg-primary w-full p-4">
        <NavHeader link="/" showTitle={true}></NavHeader>
      </div>
      <div className="container m-auto p-12">
        <ul className="mb-12 flex flex-col w-full sm:flex-row">
          {!state.loading ? (
            opleidingniveausOptions.map((opleidingsniveau, index) => {
              return (
                <li
                  className="w-auto py-2 sm:pr-2"
                  key={opleidingsniveau.type.toString()}
                >
                  <button
                    onClick={() => {
                      navigate(
                        `/overzicht/${opleidingsniveauLeerwegOmschrijving(
                          opleidingsniveau.type
                        )}`
                      );
                    }}
                    className={`${
                      state.selectedOpleidingsNiveau === index
                        ? `bg-primary border-0 text-white`
                        : `border-primary border-2 text-primary`
                    } w-full px-6 py-3 rounded-full font-header focus:outline-none focus:ring focus:border-primary`}
                  >
                    {opleidingsniveau.title}
                  </button>
                </li>
              );
            })
          ) : (
            <div></div>
          )}
        </ul>

        <div className="w-full justify-center flex flex-col items-center">
          {state.selectedOpleidingsNiveau === null && <EmptyState></EmptyState>}
          {!state.loading && state.selectedOpleidingsNiveau === null && (
            <p className="font-body">Maak eerst een keuze</p>
          )}
          {state.loading && <SpinningCompass></SpinningCompass>}
        </div>

        {!state.loading ? (
          state.selectedOpleidingsNiveau !== null &&
          state.clustersPerNiveau
            .filter(
              (c) =>
                state.selectedOpleidingsNiveau === null ||
                c.opleidingsniveau === state.selectedOpleidingsNiveau
            )
            .filter((c) => c.clusters && c.clusters.length > 0)
            .map((clustersNiveau) => {
              return (
                <div key={clustersNiveau.naam} className="mb-12">
                  <h1 className="text-2xl font-header font-semibold mb-2 text-primary">
                    {clustersNiveau.naam.replace('_', ' ').replace('-', '/')}
                  </h1>
                  <div className="flex flex-1 flex-wrap">
                    {sort(clustersNiveau.clusters, (c) => c.naam).map((c) => {
                      return (
                        <div className="w-full md:w-1/3" key={c.naam}>
                          <ClusterVakken
                            cluster={c}
                            onClick={(vakCode) => {
                              navigate(
                                `/vak/${vakCode}/${clustersNiveau.naam}`
                              );
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
        ) : (
          <div></div>
        )}
      </div>
    </>
  );
};

export default VakkenoverzichtPage;

export function EmptyState() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="229.929"
      height="229.929"
      viewBox="0 0 229.929 229.929"
    >
      <g
        id="Group_266"
        data-name="Group 266"
        transform="translate(-220.276 -272.613)"
      >
        <g id="Group_263" data-name="Group 263" transform="translate(-309)">
          <rect
            id="Rectangle_1441"
            data-name="Rectangle 1441"
            width="155.169"
            height="170"
            rx="32"
            transform="translate(529.276 382.334) rotate(-45)"
            fill="#fff4f4"
          />
        </g>
        <g
          id="Group_265"
          data-name="Group 265"
          transform="matrix(0.485, 0.875, -0.875, 0.485, 376.883, 374.576)"
        >
          <path
            id="Path_343"
            data-name="Path 343"
            d="M1252.313,1072.227a19.324,19.324,0,0,1,10.087,2.584,14.592,14.592,0,0,1,5.375,5.554l-.58.4a13.116,13.116,0,0,0-6.72-4.134,16.176,16.176,0,0,0-7.5-.073Z"
            transform="translate(-1250.082 -1069.284)"
            fill="#355389"
          />
          <path
            id="Path_344"
            data-name="Path 344"
            d="M1263.88,1075.86s-19.064,3.181-17.286,18.074,21.889,26.479,39.839,17.268c24.147-12.391,14.61-43.892-2.577-46.329S1263.88,1075.86,1263.88,1075.86Z"
            transform="translate(-1246.477 -1064.578)"
            fill="#f47458"
          />
          <path
            id="Path_345"
            data-name="Path 345"
            d="M1309.808,1073.038s4.973-5.106,15.871-.461,11.686,26.309,1.967,25.05S1302.036,1076.164,1309.808,1073.038Z"
            transform="translate(-1284.317 -1068.314)"
            fill="#f48c7f"
          />
        </g>
        <g
          id="Group_264"
          data-name="Group 264"
          transform="translate(252.25 374.576)"
        >
          <path
            id="Path_346"
            data-name="Path 346"
            d="M1495.647,478.588l-78.408,27.969a4.858,4.858,0,0,1-6.208-2.944l-14.472-40.57a4.859,4.859,0,0,1,2.944-6.209l78.408-27.969a4.858,4.858,0,0,1,6.208,2.944l14.472,40.57A4.859,4.859,0,0,1,1495.647,478.588Z"
            transform="translate(-1396.275 -428.582)"
            fill="#86b1f2"
          />
          <path
            id="Path_347"
            data-name="Path 347"
            d="M1471.507,515.433a15.538,15.538,0,1,1-19.855-9.414A15.538,15.538,0,0,1,1471.507,515.433Z"
            transform="translate(-1424.106 -475.855)"
            fill="#fff"
          />
          <path
            id="Path_348"
            data-name="Path 348"
            d="M1473.432,521.5a4.582,4.582,0,1,1-5.855-2.776A4.581,4.581,0,0,1,1473.432,521.5Z"
            transform="translate(-1438.439 -484.101)"
            fill="#86b1f2"
          />
          <path
            id="Rectangle_1606"
            data-name="Rectangle 1606"
            d="M7.071,0h.5a7.072,7.072,0,0,1,7.072,7.072v0a0,0,0,0,1,0,0H0a0,0,0,0,1,0,0v0A7.071,7.071,0,0,1,7.071,0Z"
            transform="translate(26.292 48.439) rotate(-19.632)"
            fill="#86b1f2"
          />
          <g
            id="Group_247"
            data-name="Group 247"
            transform="translate(47.352 14.906)"
          >
            <path
              id="Path_349"
              data-name="Path 349"
              d="M1522.122,483.764a1.982,1.982,0,0,1-.666-3.848l34.276-12.227a1.982,1.982,0,0,1,1.331,3.733l-34.276,12.226A1.971,1.971,0,0,1,1522.122,483.764Z"
              transform="translate(-1520.141 -467.574)"
              fill="#fff"
            />
          </g>
          <g
            id="Group_248"
            data-name="Group 248"
            transform="translate(56.605 26.128)"
          >
            <path
              id="Path_350"
              data-name="Path 350"
              d="M1546.325,510.441a1.982,1.982,0,0,1-.666-3.849l26.77-9.549a1.982,1.982,0,0,1,1.332,3.733l-26.77,9.549A1.983,1.983,0,0,1,1546.325,510.441Z"
              transform="translate(-1544.344 -496.928)"
              fill="#fff"
            />
          </g>
        </g>
        <g
          id="Group_254"
          data-name="Group 254"
          transform="translate(346.502 309.104)"
        >
          <path
            id="Path_372"
            data-name="Path 372"
            d="M2008.258,460.248c2.95,2.355,8.082,9.931,14.63,15.251,3.831,3.111,6.781,2.32,11.67,2.911,23.2,2.8,16.912,7.546,19.694,8.012-.79,1.819-8.017,17.182-9.368,20.286a5.66,5.66,0,0,1-6.52,3.715c-4.8-.663-9.638-1.156-14.361-2.181-12.107-2.626-18.844-8.681-27.521-16.035a5.673,5.673,0,0,1-1.676-7.142C2000.362,472.231,2007.655,461.429,2008.258,460.248Z"
            transform="translate(-1989.759 -455.248)"
            fill="#466eb6"
          />
          <path
            id="Path_373"
            data-name="Path 373"
            d="M2049.591,496.824c-.1,5.055.283,6.07-1.888,5.3a30.5,30.5,0,0,1-3.807-1.7c-.871-.45-.9-1.043-.2-1.753,1.03-1.034,2.087-2.041,3.118-3.045a4.475,4.475,0,0,1,1.964-5.375c.379-.222.1.248,3.333-7.187-10.683-1.318-18.221-2.2-31.255-3.8a17.533,17.533,0,0,1-9.279-4.038q-13.965-11.684-27.921-23.377a2.576,2.576,0,0,1-.42-3.8,2.916,2.916,0,0,1,2.874-.819c2.975.373,32.141,4,35.1,4.342a19.176,19.176,0,0,1,10.326,4.439q13.719,11.488,27.473,22.935c1.256,1.049,1.6,2.012,1.156,3.178a2.457,2.457,0,0,1-3.144,1.548c-1.156-.249-1.667.1-2.064,1.169-1.8,4.836-3.049,5.906-2.616,7.671C2052.675,493.872,2051.055,496.232,2049.591,496.824Z"
            transform="translate(-1982.585 -447.169)"
            fill="#86b1f2"
          />
        </g>
      </g>
    </svg>
  );
}
