import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './ui/App';

import RootStore, { StoreProvider } from './store/RootStore';

const rootStore = new RootStore();

ReactDOM.render(
  <StoreProvider value={rootStore}>
    <App />
  </StoreProvider>,
  document.getElementById('root'),
);
