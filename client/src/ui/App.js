import React from 'react';

import { Layout } from 'antd';

import { OptionPanel } from './components/OptionsPanel/index';
import Visualization from './components/Visualization/Visualization';

// eslint-disable-next-line
import '../styles/css/antd.css';
import './App.css';

const { Footer } = Layout;

const App = () => (
  <Layout id="hdviz">
    <Layout id="app">
      <OptionPanel />
      <Visualization />
    </Layout>
    <Footer style={{ textAlign: 'center' }}>HD Viz ©2021 Created by Code of Duty</Footer>
  </Layout>
);

export default App;
