/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';

import { Button, Select, Form } from 'antd';

import { useStore } from '../../../controller/ControllerProvider';

const { Option } = Select;
const { Item } = Form;

const DatabaseSelection = () => {
  const store = useStore();

  // State per gestione UI
  const [isDatabaseSelected, setIsDatabaseSelected] = useState(false);
  const [isDatabaseListLoading, setIsDatabaseListLoading] = useState(true);
  const [isTableListLoading, setIsTableListLoading] = useState(false);

  useEffect(() => {
    // Call API to get list of database connection available
    (async () => {
      await store.setDatabases();
      setIsDatabaseListLoading(false);
    })();
  }, []);

  const onDatabaseSelection = async (_db) => {
    setIsTableListLoading(true);
    await store.setTables(_db);
    setIsDatabaseSelected(true);
    setIsTableListLoading(false);
  };

  const onTableSelection = async (_table) => {
    await store.setData(_table);
  };

  return (
    <Form>
      <Item label="Database connection" name="db" rules={[{ required: true, message: 'Please select a Database' }]}>
        <Select placeholder="Database connection" disabled={isDatabaseListLoading} loading={isDatabaseListLoading} onSelect={onDatabaseSelection}>
          {store.databases.map((item, key) => <Option key={item.databases}>{item.databases}</Option>)}
        </Select>
      </Item>
      <Item label="Data Table" name="table" rules={[{ required: true, message: 'Please select a Database' }]}>
        <Select placeholder="Table" disabled={!isDatabaseSelected} loading={isTableListLoading} onSelect={onTableSelection}>
          {store.tables.map((item, key) => <Option key={item.table_name}>{item.table_name}</Option>)}
        </Select>
      </Item>
    </Form>
  );
};

export default DatabaseSelection;
