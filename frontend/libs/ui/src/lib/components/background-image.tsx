import React from 'react';

export function BackgroundImage() {
  return (
    <div className="w-screen h-screen flex align-center items-center absolute overflow-hidden pointer-events-none">
      <div
        className="z-0 pointer-events-none w-32 h-16 rounded-xl bg-primary bg-opacity-10 "
        style={{ transform: 'scale(4) translate(0%, 0%) rotate(-45deg) ' }}
      ></div>
      <div
        className="z-0 pointer-events-none w-32 h-16 rounded-xl bg-primary bg-opacity-10 "
        style={{
          transform: 'scale(4)  translate(150%, 150%) rotate(-45deg) ',
        }}
      ></div>
      <div
        className="z-0 pointer-events-none w-32 h-16 rounded-xl bg-primary bg-opacity-10 "
        style={{
          transform: 'scale(4)  translate(150%, -100%) rotate(-45deg) ',
        }}
      ></div>
      <div
        className="z-0 pointer-events-none w-32 h-16 rounded-xl bg-primary bg-opacity-10 "
        style={{
          transform: 'scale(4)  translate(200%, -140%) rotate(-45deg) ',
        }}
      ></div>
    </div>
  );
}
