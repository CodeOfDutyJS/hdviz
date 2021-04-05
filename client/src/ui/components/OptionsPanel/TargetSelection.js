import React from 'react';

import { Form, Select } from 'antd';

import { observer } from 'mobx-react-lite';
import { useStore2 } from '../../../store/RootStore';

const { Option } = Select;
const { Item } = Form;

const TargetSelection = observer(() => {
  const { modelStore, uiStore } = useStore2();

  return (
    <Item
      label="Target"
      validateStatus={uiStore.maxTargets ? 'warning' : null}
      hasFeedback
      help={uiStore.maxTargets ? 'Max 2 target variables' : null}
    >
      <Select
        placeholder="Select target"
        mode="multiple"
        onChange={modelStore.setTargets}
        value={modelStore.targets}
      >
        {modelStore.columns.map((item) => <Option key={item.value}>{item.value}</Option>)}
      </Select>
    </Item>
  );
});

export default TargetSelection;
