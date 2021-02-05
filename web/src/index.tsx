import 'bootstrap/dist/css/bootstrap.css';
import 'rc-slider/assets/index.css';
import './style/app.scss';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './components/App';
import constate from 'constate';
import { useAppOptions } from './hooks';

export const [AppOptionsProvider, useAppOptionsContext] = constate(
  useAppOptions
);

ReactDOM.render(
  <AppOptionsProvider>
    <App />
  </AppOptionsProvider>,
  document.querySelector('.app')
);
