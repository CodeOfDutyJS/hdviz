import React from 'react';

import { Layout } from 'antd';

const { Content } = Layout;

const Visualization = () => (
  <Content>
    <svg
      id="area"
      style={{
        height: '100%',
        width: '100%',
        marginRight: '0px',
        marginLeft: '0px',
      }}
    />
  </Content>
);

export default Visualization;
