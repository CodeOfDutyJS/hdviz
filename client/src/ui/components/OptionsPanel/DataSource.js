import React, { useState, useEffect } from 'react';

import { Tabs } from 'antd';

import { FileTextOutlined, DatabaseOutlined } from '@ant-design/icons';
import UploadCSV from './UploadCSV';
import DatabaseSelection from './DatabaseSelection';
import { useStore } from '../../../controller/ControllerProvider';

const { TabPane } = Tabs;

const DataSource = () => {
  const store = useStore();

  return (
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
  );
};

export default DataSource;
