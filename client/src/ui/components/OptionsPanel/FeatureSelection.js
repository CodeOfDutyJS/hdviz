import React from 'react';

import { Form, Select } from 'antd';

import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store/RootStore';

const { Option } = Select;
const { Item } = Form;

const FeatureSelection = observer(() => {
  const { modelStore, uiStore } = useStore();

  return (
    <Item
      label="Features"
      hasFeedback
      validateStatus={uiStore.maxFeatures ? 'warning' : null}
      help={uiStore.maxFeatures ? 'Max 5 feature variables' : null}
    >
      <Select
        placeholder="Select features"
        mode="multiple"
        onChange={modelStore.setFeatures}
        value={modelStore.features}
        allowClear
      >
        {modelStore.columns.map((item) => (
          <Option key={item.value} disabled={!item.isNumber}>{item.value}</Option>
        ))}
      </Select>
    </Item>
  );
});

export default FeatureSelection;
