/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { Layout } from 'antd';
import { useStore } from '../../../controller/ControllerProvider';
// import ciao from './ciao';

const { Content } = Layout;

const Visualization = observer(() => {
  const store = useStore();

  useEffect(() => {
    // ciao();
  }, []);

  return (
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
      {/* {store.parti ? store.getForceField() : null} */}
    </Content>
  );
});

export default Visualization;
