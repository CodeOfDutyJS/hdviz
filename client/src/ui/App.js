import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { Layout, PageHeader } from 'antd';

import { OptionPanel } from './components/OptionsPanel/index';
import Visualization from './components/Visualization/Visualization';

// import 'antd/dist/antd.css';
import '../styles/css/antd.css';
import './App.css';

const { Footer } = Layout;

// eslint-disable-next-line arrow-body-style
const App = () => {
  return (
    <Layout id="hdviz">
      <Layout id="app">
        <OptionPanel />
        <Visualization />
      </Layout>
      <Footer style={{ textAlign: 'center' }}>HD Viz ©2021 Created by Code of Duty</Footer>
    </Layout>
  );
};

export default App;
