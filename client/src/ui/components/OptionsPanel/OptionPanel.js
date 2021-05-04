import React from 'react';

import {
  Layout, Collapse, PageHeader, Button, Alert,
} from 'antd';
import { observer } from 'mobx-react-lite';
import VisualizationSelection from './VisualizationSelection';
import DatasetManipulation from './DatasetManipulation';
import DataSource from './DataSource';
import { useStore } from '../../../store/RootStore';

const { Sider } = Layout;
const { Panel } = Collapse;

const OptionPanel = observer(() => {
  const { visualizationStore, uiStore } = useStore();

  return (
  /**/
    <Sider id="settingPanel" width="none">
      <PageHeader
        className="option-panel-header"
        title="Options Panel"
      />
      { uiStore.dataError?.length > 0
        ? (
          uiStore.dataError.map((error) => (
            <Alert
              type={uiStore.dataError?.length > 20 ? 'error' : error.status}
              message={error.message}
              closable
            />
          ))
        ) : null}
      <Collapse defaultActiveKey={['1', '2']}>
        <Panel header="Data source" key="1" className="panel-code">
          <DataSource />
        </Panel>
        <Panel header="Visualization" key="2" className="panel-code">
          <VisualizationSelection />
        </Panel>
        <Panel header="Dataset manipulation" key="3" className="panel-code" collapsible={uiStore.loadingDataCompleted ? null : 'disabled'}>
          <DatasetManipulation />
        </Panel>
        <Panel header="Settings" key="4" style={{ display: 'none' }} className="panel-code">
          <p>Settings </p>
        </Panel>
      </Collapse>
      <Layout id="start-button">
        <Button type="primary" shape="round" onClick={visualizationStore.start}>Start</Button>
        <Button type="default" shape="round" disabled={!visualizationStore.canSave} onClick={visualizationStore.save}>Save</Button>
      </Layout>
      {
        // MESSAGGIO DI SUCCESSO
        // {store.success ? <Alert type="success" message="Success Text" closable onClose={() => { store.success = false; }} /> : null}
      }
    </Sider>
  );
});

export default OptionPanel;
