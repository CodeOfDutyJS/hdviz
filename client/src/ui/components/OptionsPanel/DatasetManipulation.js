import React, { useState } from 'react';

import {
  Form, Select, Checkbox,
} from 'antd';

import { observer } from 'mobx-react-lite';
import { DistanceType } from '../../../utils/constant';
import FeatureSelection from './FeatureSelection';
import TargetSelection from './TargetSelection';
import { useStore } from '../../../store/RootStore';

const { Option } = Select;
const { Item } = Form;

const DatasetManipulation = observer(() => {
  const { modelStore, visualizationStore } = useStore();

  return (
    <Form>
      <FeatureSelection />
      <TargetSelection />

      {visualizationStore.visualizationSelected?.options?.distance
        ? (
          <Item label="Distance Matrix">
            <Select placeholder="Select distance" onChange={visualizationStore.setDistance}>
              <Option key={DistanceType.EUCLIDEAN}>Euclidea</Option>
              <Option key={DistanceType.MANHATTAN}>Manthattan</Option>
            </Select>
          </Item>
        ) : null}

      {visualizationStore.visualizationSelected?.options?.clustering
        ? (
          <Item label="Clustering">
            <Select />
          </Item>
        ) : null}

      <Item className="no-point" label={<Checkbox onChange={visualizationStore.setIsNormalized} checked={visualizationStore.isNormalized}>Normalization</Checkbox>}>
        {visualizationStore.isNormalized ? (
          <Select placeholder="Select normalization" onChange={visualizationStore.setNormalization}>
            <Option key="row">Row Normalization</Option>
            <Option key="col">Column Normalization</Option>
          </Select>
        ) : null}
      </Item>

    </Form>
  );
});

export default DatasetManipulation;
