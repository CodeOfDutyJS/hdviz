/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';

import {
  Form, Select, Checkbox, Button,
} from 'antd';

import { observer } from 'mobx-react-lite';
import { useStore } from '../../../controller/ControllerProvider';
import { VisualizationType, DistanceType } from '../../../utils';

const { Option } = Select;
const { Item } = Form;

const FeatureSelection = observer(() => {
  const store = useStore();
  const [maxFeatures, setMaxFeatures] = useState(false);

  const isMATRIX = () => store.visualizationSelected === VisualizationType.MATRIX && store.featuresSelected.length > 5;

  // Called when visualizationSelected in controller changed
  // when scatter plot matrix is selected setMaxFeatures
  useEffect(() => {
    if (isMATRIX()) {
      store.setFeatures(store.featuresSelected.slice(0, 5));
      setMaxFeatures(true);
    } else {
      setMaxFeatures(false);
    }
  }, [store.visualizationSelected]);

  const onFeaturesChanged = (_features) => {
    if (isMATRIX()) {
      _features.pop();
      setMaxFeatures(true);
    } else {
      setMaxFeatures(false);
    }

    // Set features in Controller
    store.setFeatures(_features);
  };

  return (
    <Item
      label="Features"
      name="features"
      validateStatus={maxFeatures ? 'warning' : null}
      hasFeedback
      help={maxFeatures ? 'Max 5 feature variables' : null}
    >
      <Select placeholder="Select features" mode="multiple" onChange={onFeaturesChanged} value={store.featuresSelected} allowClear>
        {store.columns.map((item, key) => <Option key={item}>{item}</Option>)}
      </Select>
      <></>
    </Item>
  );
});

export default FeatureSelection;
