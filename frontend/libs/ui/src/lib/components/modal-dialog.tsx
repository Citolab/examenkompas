import React from 'react';
import { useOverlay, usePreventScroll, useModal } from '@react-aria/overlays';
import { useDialog } from '@react-aria/dialog';
import { FocusScope } from '@react-aria/focus';
import { useButton } from '@react-aria/button';
import ReactToPrint from 'react-to-print';

export function ModalDialog(props) {
  const { title, children } = props;
  const closeButtonRef = React.useRef();

  // Handle interacting outside the dialog and pressing
  // the Escape key to close the modal.
  const ref = React.useRef();
  const { overlayProps } = useOverlay(props, ref);

  const { buttonProps: closeButtonProps } = useButton(
    {
      onPress: () => props.onClose(),
    },
    closeButtonRef
  );
  // Prevent scrolling while the modal is open, and hide content
  // outside the modal from screen readers.
  usePreventScroll();
  const { modalProps } = useModal();

  // Get props for the dialog and its title
  const { dialogProps, titleProps } = useDialog(props, ref);

  return (
    <div className="fixed p-1 md:p-12 z-50 top-0 left-0 bottom-0 right-0 bg-black bg-opacity-50 flex items-center justify-center">
      <FocusScope contain restoreFocus autoFocus>
        <div
          {...overlayProps}
          {...dialogProps}
          {...modalProps}
          ref={ref}
          className="w-full h-full flex flex-col relative bg-white overflow-hidden max-h-full rounded-xl"
        >
          <div className="w-full flex justify-between p-4 shadow px-4 md:px-12 items-center">
            <h3 {...titleProps} className="text-primary font-header">
              {title}
            </h3>
            <div className="flex">
              {props.button}

              <button
                className="flex items-center text-white bg-primary border-primary rounded-full py-2 px-2 text-lg font-semibold border"
                {...closeButtonProps}
                ref={closeButtonRef}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 mr-0 md:mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="hidden md:block pr-2">Sluiten</span>
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">{children}</div>
        </div>
      </FocusScope>
    </div>
  );
}
