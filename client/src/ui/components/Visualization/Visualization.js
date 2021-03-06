/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { Layout } from 'antd';
import { useStore } from '../../../controller/ControllerProvider';
import ciao from './ciao';

const { Content } = Layout;

const Visualization = observer(() => {
  const store = useStore();

  useEffect(() => {
    ciao();
  }, []);

  return (
    <Content>
      <svg id="area" height={600} width={606} />
    </Content>
  );
});

export default Visualization;
