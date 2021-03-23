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
  const [columns, setColumns] = useState([]);
  const [targets, setTargets] = useState([]);
  const [maxTarget, setMaxTarget] = useState(false);

  // Called when columns in controller changed
  // when the data are loaded and the columns are extracted from dataset
  useEffect(() => {
    try {
      setColumns(store.columns);
    } catch (error) {
      console.log(error);
    }
  }, [store.columns]);

  // Called when targetSelected in controller changed
  useEffect(() => {
    setTargets(store.targetSelected);
  }, [store.targetSelected]);

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
      <Select placeholder="Select target" mode="multiple" onChange={onTargetChanged} value={targets}>
        {columns.map((item, key) => <Option key={item}>{item}</Option>)}
      </Select>
    </Item>
  );
});

export default TargetSelection;
