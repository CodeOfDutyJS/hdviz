import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './ui/App';

import { ControllerProvider } from './controller/ControllerProvider';
import Controller from './controller/Controller';

import RootStore, { StoreProvider } from './store/RootStore';

const controller = new Controller();

const rootStore = new RootStore();

ReactDOM.render(
  <StoreProvider value={rootStore}>
    <ControllerProvider value={controller}>
      <App />
    </ControllerProvider>
  </StoreProvider>,
  document.getElementById('root'),
);
