/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';

import {
  Form, Select, Checkbox, Button,
} from 'antd';

import { observer } from 'mobx-react-lite';
import { useStore } from '../../../controller/ControllerProvider';
import { VisualizationType, DistanceType } from '../../../utils/constant';
import FeatureSelection from './FeatureSelection';
import TargetSelection from './TargetSelection';
import { useStore2 } from '../../../store/RootStore';

const { Option } = Select;
const { Item } = Form;

const DatasetManipulation = observer(() => {
  const { modelStore, visualizationStore } = useStore2();

  const store = useStore();
  const [normalized, setNormalized] = useState(false);
  const [isDistanceMatrix, setIsDistanceMatrix] = useState(true);

  const onNormalizeCheckboxChanged = (e) => {
    setNormalized(e.target.checked);
  };

  const onMatrixCheckboxChanged = (e) => {
    setIsDistanceMatrix(e.target.checked);
  };

  const onDistanceChanged = (_distance) => {
    store.setDistance(_distance);
  };

  return (
    <Form>
      <FeatureSelection />
      <TargetSelection />

      {visualizationStore.visualizationSelected?.options?.distance
        ? (
          // eslint-disable-next-line max-len
          <Item className="no-point" label={<Checkbox onChange={onMatrixCheckboxChanged} checked={isDistanceMatrix}>Calculate Distance Matrix</Checkbox>}>
            {isDistanceMatrix ? (
              <Select placeholder="Select distance" onChange={visualizationStore.setDistance}>
                <Option key={DistanceType.EUCLIDEAN}>Euclidea</Option>
                <Option key={DistanceType.MANHATTAN}>Manthattan</Option>
              </Select>
            ) : null}
          </Item>
        ) : null}
    </Form>
  );
});

export default DatasetManipulation;
