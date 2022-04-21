import React from 'react';

export function ContactUs() {
  return (
    <a
      className="inline-block"
      href="mailto:citolab@cito.nl?subject=Examenkompas"
      rel="noreferrer"
      target="_blank"
    >
      <div className="mr-3 bg-white text-primary p-3 rounded-full flex items-start justify-center">
        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
          />
        </svg>
        <div className="flex font-body text-secondary text-gray-500 no-underline hover:no-underline ml-4">
          Vragen of opmerkingen?
        </div>
      </div>
    </a>
  );
}
