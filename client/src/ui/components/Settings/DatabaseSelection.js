/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';

import { Button, Select, Form } from 'antd';

const { Option } = Select;
const { Item } = Form;

const DatabaseSelection = () => {
  const [databaseList, setDatabaseList] = useState([]);
  const [tableList, setTableList] = useState([]);
  const [isDatabaseSelected, setIsDatabaseSelected] = useState(false);
  const [isDatabaseListLoading, setIsDatabaseListLoading] = useState(true);
  const [isTableListLoading, setIsTableListLoading] = useState(false);

  useEffect(() => {
    // Call API to get list of database connection available
    (async () => {
      setTimeout(() => {
        setDatabaseList([
          'Database 1',
          'Database 2',
          'Database 3',
        ]);
        setIsDatabaseListLoading(false);
      }, 1000);
    })();
  });

  const testConnection = (values) => {
    console.log(values);
  };

  const onDatabaseSelection = async () => {
    // Call API to get list of table available
    setIsTableListLoading(true);
    setTimeout(() => {
      setTableList([
        'Table 1',
        'Table 2',
        'Table 3',
      ]);
      setIsDatabaseSelected(true);
      setIsTableListLoading(false);
    }, 1000);
  };

  return (
    <Form onFinish={testConnection}>
      <Item label="Database connection" name="db" rules={[{ required: true, message: 'Please select a Database' }]}>
        <Select placeholder="Database connection" disabled={isDatabaseListLoading} loading={isDatabaseListLoading} onSelect={onDatabaseSelection}>
          {databaseList.map((item, key) => <Option key={key}>{item}</Option>)}
        </Select>
      </Item>
      <Item label="Data Table" name="table" rules={[{ required: true, message: 'Please select a Database' }]}>
        <Select placeholder="Table" disabled={!isDatabaseSelected} loading={isTableListLoading}>
          {tableList.map((item, key) => <Option key={key}>{item}</Option>)}
        </Select>
      </Item>
      <Item>
        <Button type="primary" htmlType="submit">Test</Button>
      </Item>
    </Form>
  );
};

export default DatabaseSelection;
