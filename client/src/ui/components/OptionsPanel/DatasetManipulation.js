/* eslint-disable max-len */
import React, { useState, useEffect } from 'react';

import {
  Form, Select, Checkbox, Button,
} from 'antd';

import { observer } from 'mobx-react-lite';
import { useStore } from '../../../controller/ControllerProvider';
import { VisualizationType, DistanceType } from '../../../utils';
import FeatureSelection from './FeatureSelection';
import TargetSelection from './TargetSelection';

const { Option } = Select;
const { Item } = Form;

const DatasetManipulation = observer(() => {
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

      {/* <Item className="no-point" label={<Checkbox onChange={onNormalizeCheckboxChanged}>Normalize data</Checkbox>}>
        {normalized ? (
          <Select placeholder="Select what normalize">
            <Option key="1">Globale</Option>
            <Option key="2">Righe</Option>
            <Option key="3">Colonne</Option>
          </Select>
        ) : null}
      </Item> */}

      {store.visualizationSelected === VisualizationType.FORCEFIELD
        ? (
          // eslint-disable-next-line max-len
          <Item className="no-point" label={<Checkbox onChange={onMatrixCheckboxChanged} checked={isDistanceMatrix}>Calculate Distance Matrix</Checkbox>}>
            {isDistanceMatrix ? (
              <Select placeholder="Select distance" onChange={onDistanceChanged}>
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
