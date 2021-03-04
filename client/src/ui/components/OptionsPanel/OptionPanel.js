import React, { useState, useEffect } from 'react';

import {
  Layout, Collapse, Tabs, PageHeader, Button, Alert,
} from 'antd';

import { FileTextOutlined, DatabaseOutlined } from '@ant-design/icons';

import { observer } from 'mobx-react-lite';
import UploadCSV from './UploadCSV';
import DatabaseSelection from './DatabaseSelection';
import VisualizationSelection from './VisualizationSelection';
import DatasetManipulation from './DatasetManipulation';
import { useStore } from '../../../controller/ControllerProvider';

const { Sider } = Layout;
const { Panel } = Collapse;

const { TabPane } = Tabs;

// eslint-disable-next-line arrow-body-style
const OptionPanel = observer(() => {
  const store = useStore();
  const [success, setSuccess] = useState(false);
  const callback = (e) => {
    console.log(e);
  };
  const [loadingData, setLoadingData] = useState(!store.loadingData);

  const text = `gfsdgdsfgsdg
  sdgsd
  g
  dsgsd
  gsdgsdgsdgsdgsd`;

  const showResult = () => {
    // logica con controller
    setSuccess(true);
  };
  useEffect(() => {
    console.log(store.data);
  }, [store.data]);

  return (
    <Sider id="settingPanel" width="none">
      <PageHeader
        className="option-panel-header"
        title="Options Panel"
      />
      <Collapse defaultActiveKey={['1', '2']} onChange={callback}>
        <Panel header="Data source" key="1">
          <Tabs>
            <TabPane
              tab={(
                <span>
                  <FileTextOutlined />
                  File CSV
                </span>
              )}
              key="csv"
            >
              <UploadCSV />
            </TabPane>

            <TabPane
              tab={(
                <span>
                  <DatabaseOutlined />
                  Database
                </span>
              )}
              key="database"
            >
              <DatabaseSelection />
            </TabPane>
          </Tabs>
        </Panel>
        <Panel header="Visualization" key="2">
          <VisualizationSelection />
        </Panel>
        <Panel header="Dataset manipulation" key="3" collapsible={store.loadingCompleted ? 'header' : 'disabled'}>
          <DatasetManipulation />
        </Panel>
        <Panel header="Settings" key="4" style={{ display: 'none' }}>
          <p>{text}</p>
        </Panel>
      </Collapse>
      <Layout id="start-button">
        <Button type="primary" shape="round" onClick={showResult}>Start</Button>
      </Layout>

      {success ? <Alert type="success" message="Success Text" closable onClose={() => { setSuccess(false); }} /> : null}
    </Sider>
  );
});

export default OptionPanel;
