/* eslint-disable react/no-array-index-key */
import React, { useEffect } from 'react';

import { Select, Form } from 'antd';

import { observer } from 'mobx-react-lite';
import { useStore2 } from '../../../store/RootStore';

const { Option } = Select;
const { Item } = Form;

const DatabaseSelection = observer(() => {
  const { databaseStore } = useStore2();

  useEffect(() => {
    // Call API to get list of database connection available
    databaseStore.setDatabases();
  }, []);

  return (
    <Form>
      <Item label="Database connection" name="db" rules={[{ required: true, message: 'Please select a database' }]}>
        <Select
          placeholder="Database connection"
          disabled={databaseStore.databasesLoading}
          loading={databaseStore.databasesLoading}
          onSelect={databaseStore.setDatabaseSelected}
          value={databaseStore.databaseSelected}
        >
          {databaseStore.databases.map((item) => <Option key={item.databases}>{item.databases}</Option>)}
        </Select>
      </Item>

      <Item label="Data Table" name="table" rules={[{ required: true, message: 'Please select a table' }]}>
        <Select
          placeholder="Table"
          disabled={!databaseStore.databaseSelected || databaseStore.tablesLoading}
          loading={databaseStore.tablesLoading}
          onSelect={databaseStore.setTableSelected}
          value={databaseStore.tableSelected}
        >
          {databaseStore.tables.map((item) => <Option key={item.table_name}>{item.table_name}</Option>)}
        </Select>
      </Item>
    </Form>
  );
});

export default DatabaseSelection;
