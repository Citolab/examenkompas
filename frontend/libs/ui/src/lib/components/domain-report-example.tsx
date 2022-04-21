import React from 'react';

import { useOverlayTriggerState } from '@react-stately/overlays';
import {
  useOverlay,
  usePreventScroll,
  useModal,
  OverlayProvider,
  OverlayContainer,
} from '@react-aria/overlays';
import { useButton } from '@react-aria/button';
import { ModalDialog } from './modal-dialog';
import { examen, niveau, report, vaknaam } from './domain-report-example.data';
import DomeinRapportage from './domain-report';

export function DomainReportExample() {
  const state = useOverlayTriggerState({});
  const openButtonRef = React.useRef();

  // useButton ensures that focus management is handled correctly,
  // across all browsers. Focus is restored to the button once the
  // dialog closes.
  const { buttonProps: openButtonProps } = useButton(
    {
      onPress: () => state.open(),
    },
    openButtonRef
  );

  return (
    <>
      <button
        {...openButtonProps}
        ref={openButtonRef}
        className="bg-white border-2 border-red-500 text-red-500 rounded-full py-2 px-5 text-lg font-semibold"
      >
        Voorbeeldrapportage
      </button>

      {state.isOpen && (
        <OverlayContainer>
          <ModalDialog
            title="Voorbeeldrapportage"
            isOpen
            onClose={state.close}
            isDismissable
          >
            <DomeinRapportage
              vaknaam={vaknaam}
              niveau={niveau}
              report={report}
              examen={examen}
              loadingReport={false}
            ></DomeinRapportage>
          </ModalDialog>
        </OverlayContainer>
      )}
    </>
  );
}

// Application must be wrapped in an OverlayProvider so that it can be
// hidden from screen readers when a modal opens.
<OverlayProvider>
  <DomainReportExample></DomainReportExample>
</OverlayProvider>;
