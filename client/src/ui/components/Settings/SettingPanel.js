import React, { useState, useEffect } from 'react';

import { Layout, Collapse, Tabs } from 'antd';

import { FileTextOutlined, DatabaseOutlined } from '@ant-design/icons';

import UploadCSV from './UploadCSV';
import DatabaseSelection from './DatabaseSelection';
import VisualizationSelection from './VisualizationSelection';

const { Sider } = Layout;
const { Panel } = Collapse;

const { TabPane } = Tabs;

// eslint-disable-next-line arrow-body-style
const SettingsPanel = () => {
  const callback = (e) => {
    console.log(e);
  };

  const text = `gfsdgdsfgsdg
  sdgsd
  g
  dsgsd
  gsdgsdgsdgsdgsd`;

  return (
    <Sider id="settingPanel" width="none">
      <Collapse defaultActiveKey={['1', '2', '3']} onChange={callback}>
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
        <Panel header="This is panel header 3" key="3">
          <p>{text}</p>
        </Panel>
      </Collapse>
    </Sider>
  );
};

export default SettingsPanel;
