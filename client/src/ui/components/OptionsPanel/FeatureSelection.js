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
  const [columns, setColumns] = useState([]);
  const [features, setFeatures] = useState([]);
  const [maxFeatures, setMaxFeatures] = useState(false);

  // eslint-disable-next-line max-len
  const isMATRIX = (_f) => store.visualizationSelected === VisualizationType.MATRIX && _f.length > 5;

  // Called when columns in controller changed
  // when the data are loaded and the columns are extracted from dataset
  useEffect(() => {
    try {
      setColumns(store.columns);
    } catch (error) {
      console.log(error);
    }
  }, [store.columns]);

  // Called when visualizationSelected in controller changed
  // when scatter plot matrix is selected setMaxFeatures
  useEffect(() => {
    if (isMATRIX(features)) {
      store.setFeatures(features.slice(0, 5));
      setMaxFeatures(true);
    } else {
      setMaxFeatures(false);
    }
  }, [store.visualizationSelected]);

  // Called when featuresSelected in controller changed
  useEffect(() => {
    setFeatures(store.featuresSelected);
  }, [store.featuresSelected]);

  const onFeaturesChanged = (_features) => {
    if (isMATRIX(_features)) {
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
      <Select placeholder="Select features" mode="multiple" onChange={onFeaturesChanged} value={features} allowClear>
        {columns.map((item, key) => <Option key={item}>{item}</Option>)}
      </Select>
      <></>
    </Item>
  );
});

export default FeatureSelection;
