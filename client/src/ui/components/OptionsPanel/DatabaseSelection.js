/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';

import { Button, Select, Form } from 'antd';

import { useStore } from '../../../controller/ControllerProvider';

const { Option } = Select;
const { Item } = Form;

const DatabaseSelection = () => {
  const controller = useStore();
  const [databaseList, setDatabaseList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [isDatabaseSelected, setIsDatabaseSelected] = useState(false);
  const [isDatabaseListLoading, setIsDatabaseListLoading] = useState(true);
  const [isTableListLoading, setIsTableListLoading] = useState(false);
  const [dbSelected, setDbSelected] = useState();

  useEffect(() => {
    // Call API to get list of database connection available
    (async () => {
      setDatabaseList(await controller.getDatabases());
      setIsDatabaseListLoading(false);
    })();
  }, []);

  const testConnection = (values) => {
    console.log(values);
  };

  const onDatabaseSelection = async (_db) => {
    // Call API to get list of table available
    setIsTableListLoading(true);
    setDbSelected(_db);
    setTableList(await controller.getTables(_db));
    setIsDatabaseSelected(true);
    setIsTableListLoading(false);
  };

  const onTableSelection = async (_table) => {
    await controller.setData(dbSelected, _table);
    // console.log(controller.data);
  };

  return (
    <Form onFinish={testConnection}>
      <Item label="Database connection" name="db" rules={[{ required: true, message: 'Please select a Database' }]}>
        <Select placeholder="Database connection" disabled={isDatabaseListLoading} loading={isDatabaseListLoading} onSelect={onDatabaseSelection}>
          {databaseList.map((item, key) => <Option key={item.databases}>{item.databases}</Option>)}
        </Select>
      </Item>
      <Item label="Data Table" name="table" rules={[{ required: true, message: 'Please select a Database' }]}>
        <Select placeholder="Table" disabled={!isDatabaseSelected} loading={isTableListLoading} onSelect={onTableSelection}>
          {tableList.map((item, key) => <Option key={item.table_name}>{item.table_name}</Option>)}
        </Select>
      </Item>
      {/* <Item>
        <Button type="primary" htmlType="submit" disabled={controller.button}>Test</Button>
      </Item> */}
    </Form>
  );
};

export default DatabaseSelection;
