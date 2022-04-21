import React from 'react';

import { useOverlayTriggerState } from '@react-stately/overlays';
import { OverlayProvider, OverlayContainer } from '@react-aria/overlays';
import { useButton } from '@react-aria/button';
import { ModalDialog } from './modal-dialog';

export function FrequentlyAskedQuestions() {
  const state = useOverlayTriggerState({});
  const openButtonRef = React.useRef();
  const closeButtonRef = React.useRef();

  // useButton ensures that focus management is handled correctly,
  // across all browsers. Focus is restored to the button once the
  // dialog closes.
  const { buttonProps: openButtonProps } = useButton(
    {
      onPress: () => state.open(),
    },
    openButtonRef
  );

  const { buttonProps: closeButtonProps } = useButton(
    {
      onPress: () => state.close(),
    },
    closeButtonRef
  );

  return (
    <>
      <button
        className="font-header text-primary"
        {...openButtonProps}
        ref={openButtonRef}
      >
        F.A.Q.
      </button>
      {state.isOpen && (
        <OverlayContainer>
          <ModalDialog
            title="F.A.Q."
            isOpen
            onClose={state.close}
            isDismissable
          >
            <div className="px-4 md:px-12 pb-12">
              <h3 className="mt-6 font-header text-gray-700">
                Mijn cijfer wijkt af van het cijfer dat ik eerder van mijn
                leraar heb gekregen op hetzelfde examen. Hoe kan dat?
              </h3>

              <div className="mt-2 font-body text-gray-500">
                Als je een examen al eerder hebt gemaakt kan het zijn dat je
                jezelf anders hebt nagekeken je leraar toen heeft gedaan. Dat
                leidt tot een ander cijfer. Ook kan het zijn dat je leraar op
                een andere manier het cijfer heeft berekend. Examenkompas
                berekent het cijfer op de manier waarop dat ook bij de Centrale
                Examens gebeurt en zoals wordt beschreven op{' '}
                <a
                  className="underline text-primary hover:text-primary-dark visited:text-purple-600"
                  href="https://zoek.officielebekendmakingen.nl/stcrt-2019-9325.html"
                >
                  deze website
                </a>
                .
              </div>

              <h3 className="mt-6 font-header text-gray-700">
                Hoe interpreteer ik de balkjes met mijn score op de
                vakonderwerpen in het rapport?{' '}
              </h3>

              <div className="mt-2 font-body text-gray-500">
                Hier kun je zien hoeveel procent van de punten je hebt gehaald
                op vragen in je oefenexamen die over dat onderwerp gingen. Je
                kunt ook zien hoe leerlingen die eerder het examen hebben
                gemaakt (in het jaar dat je oefenexamen een echt examen was)
                hebben gescoord op dat onderwerp. Ongeveer 68% van de leerlingen
                heeft een percentage gescoord dat in het weergegeven balkje
                ligt. Daarmee kun je bijvoorbeeld zien of andere leerlingen ook
                moeite hadden met een onderwerp wat jij moeilijk vond. Als je
                veel lager scoort dan de andere leerlingen is het de moeite
                waard om verder te leren over dat onderwerp.{' '}
              </div>

              <h3 className="mt-6 font-header text-gray-700">
                In mijn rapport staat er "onvolledig" bij een onderwerp. Wat
                betekent dat?
              </h3>

              <div className="mt-2 font-body text-gray-500">
                Dat betekent dat je nog niet voor alle vragen die over dat
                onderwerp gingen een score hebt ingevuld. Daarom kunnen we je
                score op dat onderwerp nog niet tonen. Ga terug naar het
                invulscherm en vul de rest van de scores in.
              </div>

              {/* <h3 className="mt-6 font-header text-gray-700">
                Waar vind ik wat ik allemaal moet leren voor mijn examens?{' '}
              </h3>

              <div className="mt-2 font-body text-gray-500">
                Op{' '}
                <a
                  className="underline text-primary hover:text-primary-dark visited:text-purple-600"
                  href="https://www.lerenvoorhetexamen.nl"
                >
                  lerenvoorhetexamen.nl
                </a>{' '}
                kun je voor ieder vak zien wat je moet kennen en kunnen voor je
                examen. Je vindt hier ook leermateriaal per onderwerp. Iedere
                dag komt er nog meer behulpzaam materiaal bij, dus kom vooral
                regelmatig terug terwijl je je voorbereid voor je examens!
              </div> */}

              <h3 className="mt-6 font-header text-gray-700">
                Wat betekenen de letters achter de onderwerpen op het
                rapportagescherm?
              </h3>

              <div className="mt-2 font-body text-gray-500">
                De letters achter de onderwerpen op het rapportagescherm
                verwijzen naar de domeinen die je moet beheersen volgens het
                examenprogramma. De volledige lijst van domeinen kun je
                terugvinden in het examenprogramma voor elk vak, bijvoorbeeld op
                {` `}
                <a
                  className="underline text-primary hover:text-primary-dark visited:text-purple-600"
                  href="http://examenblad.nl"
                >
                  Examenblad.nl
                </a>
                .
              </div>

              <h3 className="mt-6 font-header text-gray-700">
                Op welke apparaten kan ik Examenkompas gebruiken?
              </h3>

              <div className="mt-2 font-body text-gray-500">
                Examenkompas is geschikt voor gebruik op de computer, laptop,
                tablet en smartphone.
              </div>

              <h3 className="mt-6 font-header text-gray-700">
                Waarom kan ik niet alle vakken vinden op Examenkompas?
              </h3>
              <div className="mt-2 font-body text-gray-500">
                Een aantal vakken staan niet op Examenkompas om verschillende
                redenen. We hebben alleen examens opgenomen waarvan de vragen
                relevant zijn voor jouw examen dit jaar. Examens van vakken
                waarin de laatste jaren grote veranderingen zijn geweest staan
                dus niet op Examenkompas. Ook zijn er een aantal vakken waarvan
                we niet voldoende data over de vakspecifieke onderwerpen hebben.
                Hier kunnen we dus helaas geen betekenisvolle rapportage over
                geven.
                {/* Je kunt de examens van de vakken die op Examenkompas
                ontbreken wel vinden op{' '}
                <a
                  className="underline text-primary hover:text-primary-dark visited:text-purple-600"
                  href="http://lerenvoorhetexamen.nl"
                >
                  lerenvoorhetexamen.nl
                </a>
                . */}
              </div>

              <h3 className="mt-6 font-header text-gray-700">
                Slaat examenkompas persoonlijke gegevens van mij op?
              </h3>

              <div className="mt-2 font-body text-gray-500">
                Nee, het gebruik van Examenkompas is anoniem.
              </div>
            </div>
          </ModalDialog>
        </OverlayContainer>
      )}
    </>
  );
}

// Application must be wrapped in an OverlayProvider so that it can be
// hidden from screen readers when a modal opens.
<OverlayProvider>
  <FrequentlyAskedQuestions></FrequentlyAskedQuestions>
</OverlayProvider>;
