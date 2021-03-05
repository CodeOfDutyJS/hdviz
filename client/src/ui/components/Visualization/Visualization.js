import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { Layout } from 'antd';

import { useStore } from '../../../controller/ControllerProvider';

const { Content } = Layout;

const Visualization = observer(() => {
  const store = useStore();
  return (
    <Content id="visualization">{store.getVisualization()}</Content>
  );
});

export default Visualization;
