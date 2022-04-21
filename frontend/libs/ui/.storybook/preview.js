// import React from 'react';
import { addDecorator } from '@storybook/react';

import '../src/styles.scss';

// PK: necessary so we don't get any errors with the Link tag in react router in storybook
// import { MemoryRouter } from 'react-router';
// addDecorator(story => <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>);

// PK: extra decorator, just a react component around our story component
addDecorator((storyFn) => <>{storyFn()}</>);

// PK: necessary so we don't get any errors with the Link tag in react router in storybook
// import { MemoryRouter } from 'react-router';
// addDecorator(story => <MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>);

// PK: extra decorator, just a react component around our story component
// addDecorator((storyFn) => <div className="w-screen h-screen">{storyFn()}</div>);

// PK: full screen, else there will be a padding on the body
// Usefull if storybook components consists of full page layouts which uses 100vw 100vh
export const parameters = { layout: 'fullscreen' };
