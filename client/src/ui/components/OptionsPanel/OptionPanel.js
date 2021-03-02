import React, { useState, useEffect } from 'react';

import {
  Layout, Collapse, Tabs, PageHeader,
} from 'antd';

import { FileTextOutlined, DatabaseOutlined } from '@ant-design/icons';

import UploadCSV from './UploadCSV';
import DatabaseSelection from './DatabaseSelection';
import VisualizationSelection from './VisualizationSelection';
import DatasetManipulation from './DatasetManipulation';

const { Sider } = Layout;
const { Panel } = Collapse;

const { TabPane } = Tabs;

// eslint-disable-next-line arrow-body-style
const OptionPanel = () => {
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
      <PageHeader
        className="option-panel-header"
        title="Options Panel"
      />
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
        <Panel header="Dataset manipulation" key="3">
          <DatasetManipulation />
        </Panel>
        <Panel header="Settings" key="4">
          <p>{text}</p>
        </Panel>
        <Panel header="Dataset manipulation" key="5">
          <p>{text}</p>
        </Panel>
      </Collapse>
    </Sider>
  );
};

export default OptionPanel;
