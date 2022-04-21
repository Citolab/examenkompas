import React from 'react';
import {
  BackgroundImage,
  ContactUs,
  CookieConsent,
  DomainReportExample,
  ExternalLink,
  FrequentlyAskedQuestions,
  KompasZdog,
} from '@examenkompas/ui';
import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();
  return (
    <>
      <BackgroundImage></BackgroundImage>
      <div className="container mx-auto p-4 md:p-12 lg:px-32">
        <div className="flex">
          <div className="w-full sm:w-1/2">
            <h2 className="font-header text-xl text-secondary-light">
              Examenkompas
            </h2>
            <h1 className="text-4xl font-semibold font-header leading-tight mb-5">
              Weten wat je beheerst?
            </h1>
            <p className="text-lg font-body">
              Oude examens zijn goed oefenmateriaal, maar hoe weet je na het
              oefenen hoe je ervoor staat? Examenkompas helpt je daarbij. Na het
              zelf maken en nakijken van een oud examen zie je je cijfer, welke
              onderwerpen je al beheerst én welke je nog kunt oefenen. Geen
              inlog of docent nodig; je kunt meteen starten.
            </p>
            <div className="py-5 flex justify-between">
              <button
                onClick={() => navigate(`/overzicht`)}
                className="text-white bg-primary border-primary rounded-full py-2 px-5 text-lg font-semibold inline-block border mt-5"
              >
                Naar vakken
              </button>
            </div>
          </div>
          <div className="hidden sm:flex w-full sm:w-1/2 sm:items-center">
            {/* <iframe src="https://3ut17.csb.app/" className="w-full h-full" title="kompas" /> */}

            <KompasZdog></KompasZdog>
            {/* <img
              src="/assets/images/logo.svg"
              style={{
                transform:
                  'scale(1) perspective(1040px) rotateY(0deg) rotateX(0deg) rotate(0deg)',
              }}
              alt=""
            /> */}
          </div>
        </div>
        <div className="mt-16 grid gap-x-8 gap-y-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="font-header mb-3 flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 sm:-ml-7 sm:mr-1 text-primary"
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
              Zoek examen
            </h3>
            <p className="font-body text-gray-500">
              Zoek een vak om te oefenen uit de vorige examens van VWO, HAVO en
              VMBO-GL/TL.
            </p>
          </div>
          <div>
            <h3 className="font-header mb-3 flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 sm:-ml-7 sm:mr-1 text-primary"
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
              Maak examen
            </h3>
            <p className="font-body text-gray-500">
              Oefen wat je geleerd hebt door vragen uit het examen te maken. Je
              hoeft niet alles te maken.
            </p>
          </div>
          <div>
            <h3 className="font-header mb-3 flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 sm:-ml-7 sm:mr-1 text-primary"
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
              Kijk na
            </h3>
            <p className="font-body text-gray-500">
              Kijk je antwoorden na en zie meteen welke stof je nog niet
              beheerst.
            </p>
          </div>
          <div>
            <h3 className="font-header mb-3 flex">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-6 h-6 sm:-ml-7 sm:mr-1 text-primary"
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
              Wat beheers ik?
            </h3>
            <p className="font-body text-gray-500">
              Als je het hele examen ingevuld en nagekeken hebt zie je een
              gedetailleerd overzicht over de onderwerpen die je nog kunt
              oefenen.
            </p>
          </div>
        </div>
        <div className="w-full md:w-auto whitespace-nowrap md:text-right mt-3">
          <DomainReportExample></DomainReportExample>
        </div>
      </div>
      {/* footer bg-gray-100 relative pt-1 border-b-2 border-blue-700 */}
      <footer className="footer bg-gray-100 mt-4: md:mt-12">
        <div className="container mx-auto p-4 md:px-12 lg:px-32">
          <div className="sm:flex sm:mt-8">
            <div className="mt-8 sm:mt-0 sm:w-full flex flex-col md:flex-row justify-between">
              <div className="flex flex-col flex-1">
                <span className="font-bold text-gray-700 uppercase mb-2">
                  Disclaimer
                </span>
                <p className="text-gray-500 pr-8">
                  Examenkompas is gemaakt om je te ondersteunen bij de
                  voorbereiding op de Centrale Examens. Het 'echte' examen heeft
                  andere opgaven en je bent dan waarschijnlijk zenuwachtiger dan
                  nu. Dat kan invloed hebben op je resultaten. Het weergegeven
                  resultaat is een indicatie en biedt geen garantie voor scores
                  op het Centraal Examen.
                </p>
                <p className="text-gray-500 mt-2 pr-8">
                  Deze website gebruikt cookies. Ze worden gebruikt om je scores
                  en je rapport bij te houden. We gebruiken geen privacy
                  gevoelige informatie.
                </p>
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-bold text-gray-700 uppercase mt-4 md:mt-0 mb-2">
                  Ontwikkeld door
                </span>
                <span className="my-2">
                  <ExternalLink
                    name="citolab"
                    link="https://www.cito.nl/kennis-en-innovatie/prototypes"
                  ></ExternalLink>
                </span>
                <span className="my-2">
                  <ExternalLink
                    name="Kennisnet"
                    link="https://www.kennisnet.nl/"
                  ></ExternalLink>
                </span>
              </div>
              <div className="flex flex-col flex-1">
                <span className="font-bold text-gray-700 uppercase mt-4 md:mt-0 mb-2">
                  Contact
                </span>
                <ContactUs></ContactUs>
                <p className="mt-4">
                  Lees ook de{' '}
                  <FrequentlyAskedQuestions></FrequentlyAskedQuestions>
                </p>

                <span className="my-2">
                  {/* <p className="my-2">Cito Klantenservice</p> */}
                  {/* Telefoon:{' '}
              <a className="link" href="tel://0031-26-3521111">
                (026) 352 11 11
              </a> */}
                  <p className="w-24 inline-block">E-mail:</p>
                  <a
                    className="link"
                    href="mailto:citolab@cito.nl"
                    target="_blank"
                    rel="noreferrer"
                  >
                    citolab@cito.nl
                  </a>

                  <div className="d-flex my-2">
                    <p className="w-24 inline-block">Facebook:</p>
                    <a
                      className="link"
                      href="https://www.facebook.com/Cito-139479919400498"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Cito
                    </a>
                  </div>

                  <p className="w-24 inline-block">Twitter:</p>
                  <a
                    className="link"
                    href="https://twitter.com/cito"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    @Cito
                  </a>
                  <br />
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="container mx-auto md:px-12 lg:px-32">
          <div className="mt-16 border-t-2 border-gray-300 flex flex-col items-center">
            <div className="sm:w-2/3 text-center py-6">
              <p className="text-sm text-secondary font-bold mb-2">
                © 2021 door citolab
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
export default HomePage;
