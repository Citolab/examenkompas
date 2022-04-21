import React from 'react';

export function CookieConsent() {
  return (
    <div
      // className="w-screen h-screen bg-gray-100 flex items-center justify-center px-5 py-5 relative"
      x-data="{showCookieBanner:true}"
    >
      <section
        className="w-full p-5 lg:px-24 top-0 bg-gray-600"
        x-show="showCookieBanner"
      >
        <div className="md:flex items-center -mx-3">
          <div className="md:flex-1 px-3 mb-5 md:mb-0">
            <div className="text-center md:text-left text-white text-xs leading-tight md:pr-12">
              We and selected partners and related companies, use cookies and
              similar technologies as specified in our Cookies Policy. You agree
              to consent to the use of these technologies by clicking Accept, or
              by continuing to browse this website. You can learn more about how
              we use cookies and set cookie preferences in Settings.
            </div>
          </div>
          <div className="px-3 text-center">
            <button
              id="btn"
              className="py-2 px-8 bg-gray-800 hover:bg-gray-900 text-white rounded font-bold text-sm shadow-xl mr-3"
              // onClick={() => document.getElementById('cookiesModal').showModal()}
            >
              Cookie settings
            </button>
            <button
              id="btn"
              className="py-2 px-8 bg-green-400 hover:bg-green-500 text-white rounded font-bold text-sm shadow-xl"
              // onClick={() => (showCookieBanner = !showCookieBanner)}
            >
              Accept cookies
            </button>
          </div>
        </div>
      </section>
      <dialog
        id="cookiesModal"
        className="h-auto w-11/12 md:w-1/2 bg-white overflow-hidden rounded-md p-0"
      >
        <div className="flex flex-col w-full h-auto">
          <div className="flex w-full h-auto items-center px-5 py-3">
            <div className="w-10/12 h-auto text-lg font-bold">
              Cookie settings
            </div>
            <div className="flex w-2/12 h-auto justify-end">
              <button
                //   onClick={() => document.getElementById('cookiesModal').close()}
                className="cursor-pointer focus:outline-none text-gray-400 hover:text-gray-800"
              >
                <i className="mdi mdi-close-circle-outline text-2xl"></i>
              </button>
            </div>
          </div>
          <div className="flex w-full items-center bg-gray-100 border-b border-gray-200 px-5 py-3 text-sm">
            <div className="flex-1">
              <div>Strictly necessary cookies</div>
            </div>
            <div className="w-10 text-right">
              <i className="mdi mdi-check-circle text-2xl text-green-400 leading-none"></i>
            </div>
          </div>
          <div className="flex w-full items-center bg-gray-100 border-b border-gray-200 px-5 py-3 text-sm">
            <div className="flex-1">
              <div>Cookies that remember your settings</div>
            </div>
            <div className="w-10 text-right">
              <i className="mdi mdi-check-circle text-2xl text-green-400 leading-none"></i>
            </div>
          </div>
          <div className="flex w-full items-center bg-gray-100 border-b border-gray-200 px-5 py-3 text-sm">
            <div className="flex-1">
              <div>Cookies that measure website use</div>
            </div>
            <div className="w-10 text-right">
              <i className="mdi mdi-check-circle text-2xl text-green-400 leading-none"></i>
            </div>
          </div>
          <div className="flex w-full items-center bg-gray-100 border-b border-gray-200 px-5 py-3 text-sm">
            <div className="flex-1">
              <div>Cookies that help with our communications and marketing</div>
            </div>
            <div className="w-10 text-right">
              <i className="mdi mdi-check-circle text-2xl text-green-400 leading-none"></i>
            </div>
          </div>
          <div className="flex w-full px-5 py-3 justify-end">
            <button
              // onClick={() => document.getElementById('cookiesModal').close()}
              className="py-2 px-8 bg-gray-800 hover:bg-gray-900 text-white rounded font-bold text-sm shadow-xl"
            >
              Save settings
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}
