import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './ui/App';

import { ControllerProvider } from './controller/ControllerProvider';
import Controller from './controller/Controller';

const controller = new Controller();

ReactDOM.render(
  <ControllerProvider value={controller}>
    <App />
  </ControllerProvider>,
  document.getElementById('root'),
);
