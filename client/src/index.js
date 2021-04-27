import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './ui/App';

import RootStore, { StoreProvider } from './store/RootStore';

import './model/VisualizationModels';

const rootStore = new RootStore();

// console.log(Object.values(VisualizationTypes.visualizations));

// eslint-disable-next-line array-callback-return
// Object.values(VisualizationTypes.visualizations).map((item) => { console.log(Object.keys(item)); });

ReactDOM.render(
  <StoreProvider value={rootStore}>
    <App />
  </StoreProvider>,
  document.getElementById('root'),
);
