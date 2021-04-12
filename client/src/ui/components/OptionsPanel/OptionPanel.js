import React from 'react';

import {
  Layout, Collapse, PageHeader, Button,
} from 'antd';

import { observer } from 'mobx-react-lite';
import VisualizationSelection from './VisualizationSelection';
import DatasetManipulation from './DatasetManipulation';
import DataSource from './DataSource';
import { useStore2 } from '../../../store/RootStore';

const { Sider } = Layout;
const { Panel } = Collapse;

const OptionPanel = observer(() => {
  const { visualizationStore, modelStore } = useStore2();

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
        <Panel header="Dataset manipulation" key="3" collapsible={modelStore.loadingCompleted ? 'header' : 'disabled'}>
          <DatasetManipulation />
        </Panel>
        <Panel header="Settings" key="4" style={{ display: 'none' }}>
          <p>Settings </p>
        </Panel>
      </Collapse>
      <Layout id="start-button">
        <Button type="primary" shape="round" onClick={visualizationStore.start}>Start</Button>
      </Layout>
      {
        // MESSAGGIO DI SUCCESSO
        // {store.success ? <Alert type="success" message="Success Text" closable onClose={() => { store.success = false; }} /> : null}
      }
    </Sider>
  );
});

export default OptionPanel;
