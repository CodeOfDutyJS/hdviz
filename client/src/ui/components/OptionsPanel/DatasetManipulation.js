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

const DatasetManipulation = observer(() => {
  const store = useStore();
  const [columns, setColumns] = useState([]);
  const [normalized, setNormalized] = useState(false);
  const [distanceMatrix, setDistanceMatrix] = useState(true);
  const [features, setFeatures] = useState([]);
  const [maxFeatures, setMaxFeatures] = useState(false);
  const [targets, setTargets] = useState([]);
  const [maxTarget, setMaxTarget] = useState(false);

  // eslint-disable-next-line max-len
  const isMATRIX = (_f) => store.visualizationSelected === VisualizationType.MATRIX && _f.length > 5;

  useEffect(() => {
    try {
      setColumns(store.columns);
    } catch (error) {
      console.log(error);
    }
  }, [store.columns]);

  useEffect(() => {
    if (isMATRIX(features)) {
      setFeatures(features.slice(0, 5));
      setMaxFeatures(true);
    } else {
      setMaxFeatures(false);
    }
  }, [store.visualizationSelected]);

  useEffect(() => {
    setFeatures(store.featuresSelected);
  }, [store.featuresSelected]);

  useEffect(() => {
    setTargets(store.targetSelected);
  }, [store.targetSelected]);

  const onNormalizeCheckboxChanged = (e) => {
    setNormalized(e.target.checked);
  };

  const onMatrixCheckboxChanged = (e) => {
    setDistanceMatrix(e.target.checked);
  };

  const onFeaturesChanged = (_features) => {
    if (isMATRIX(_features)) {
      _features.pop();
      setMaxFeatures(true);
    } else {
      setMaxFeatures(false);
    }
    store.setFeatures(_features);
  };

  const onTargetChanged = (_target) => {
    if (_target.length > 2) {
      _target.pop();
      setMaxTarget(true);
    } else {
      setMaxTarget(false);
    }
    store.setTarget(_target);
  };

  const onDistanceChanged = (_distance) => {
    store.setDistance(_distance);
  };

  return (
    <Form>
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
      {/* <Item className="no-point" label={<Checkbox onChange={onNormalizeCheckboxChanged}>Normalize data</Checkbox>}>
        {normalized ? (
          <Select placeholder="Select what normalize">
            <Option key="1">Globale</Option>
            <Option key="2">Righe</Option>
            <Option key="3">Colonne</Option>
          </Select>
        ) : null}
      </Item> */}

      {store.visualizationSelected === VisualizationType.FORCE
        ? (
          // eslint-disable-next-line max-len
          <Item className="no-point" label={<Checkbox onChange={onMatrixCheckboxChanged} checked={distanceMatrix}>Calculate Distance Matrix</Checkbox>}>
            {distanceMatrix ? (
              <Select placeholder="Select distance" onChange={onDistanceChanged}>
                <Option key={DistanceType.EUCLIDEAN}>Euclidea</Option>
                <Option key={DistanceType.MANHATTAN} disabled>Manthattan</Option>
              </Select>
            ) : null}
          </Item>
        ) : null}
    </Form>
  );
});

export default DatasetManipulation;
