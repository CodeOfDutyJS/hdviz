import React, { useState, useEffect } from 'react';

import {
  Layout, Collapse, PageHeader, Button, Alert,
} from 'antd';

import { observer } from 'mobx-react-lite';
import VisualizationSelection from './VisualizationSelection';
import DatasetManipulation from './DatasetManipulation';
import { useStore } from '../../../controller/ControllerProvider';
import DataSource from './DataSource';

const { Sider } = Layout;
const { Panel } = Collapse;

const OptionPanel = observer(() => {
  const store = useStore();

  return (
    <Sider id="settingPanel" width="none">
      <PageHeader
        className="option-panel-header"
        title="Options Panel"
      />
      <Collapse defaultActiveKey={['1', '2']}>
        <Panel header="Data source" key="1">
          <DataSource />
        </Panel>
        <Panel header="Visualization" key="2">
          <VisualizationSelection />
        </Panel>
        <Panel header="Dataset manipulation" key="3" collapsible={store.loadingCompleted ? 'header' : 'disabled'}>
          <DatasetManipulation />
        </Panel>
        <Panel header="Settings" key="4" style={{ display: 'none' }}>
          <p>Settings </p>
        </Panel>
      </Collapse>
      <Layout id="start-button">
        <Button type="primary" shape="round" onClick={() => { store.start(); }}>Start</Button>
      </Layout>

      {store.success ? <Alert type="success" message="Success Text" closable onClose={() => { store.success = false; }} /> : null}
    </Sider>
  );
});

export default OptionPanel;
