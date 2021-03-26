/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';

import {
  Form, Select, Checkbox, Button,
} from 'antd';

import { observer } from 'mobx-react-lite';
import { useStore } from '../../../controller/ControllerProvider';
import { VisualizationType, DistanceType } from '../../../utils';
import FeatureSelection from './FeatureSelection';

const { Option } = Select;
const { Item } = Form;

const TargetSelection = observer(() => {
  const store = useStore();
  const [maxTarget, setMaxTarget] = useState(false);

  const onTargetChanged = (_target) => {
    if (_target.length > 2) {
      _target.pop();
      setMaxTarget(true);
    } else {
      setMaxTarget(false);
    }

    // Set features in Controller
    store.setTarget(_target);
  };

  return (
    <Item
      label="Target"
      name="target"
      validateStatus={maxTarget ? 'warning' : null}
      hasFeedback
      help={maxTarget ? 'Max 2 target variables' : null}
    >
      <Select placeholder="Select target" mode="multiple" onChange={onTargetChanged} value={store.targetSelected}>
        {store.columns.map((item, key) => <Option key={item}>{item}</Option>)}
      </Select>
    </Item>
  );
});

export default TargetSelection;
