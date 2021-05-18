import React, { useState } from 'react';

import {
  Form, Select, Checkbox, Slider, InputNumber,
} from 'antd';

import { observer } from 'mobx-react-lite';
import NeighborsSlider from './NeighborsSlider';
import MinDistanceSlider from './MinDistanceSlider';
import SpreadSlider from './SpreadSlider';
import { DistanceType, ClusteringType } from '../../../utils/options';
import FeatureSelection from './FeatureSelection';
import TargetSelection from './TargetSelection';
import { useStore } from '../../../store/RootStore';
import NormalizationCollector from '../../../model/normalizations/NormalizationsCollector';

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
            <Select placeholder="Select clustering" onChange={visualizationStore.setClustering}>
              {Object.values(ClusteringType).map((c) => (
                <Option key={c}>
                  {`${c[0].toUpperCase()}${c.slice(1)}`}
                </Option>
              ))}
            </Select>
          </Item>
        ) : null}

      {/* visualizationStore.isNormalized */}
      { visualizationStore._visualization._visualizationSelected?.id !== 'umap' ? (
        <>
          <Checkbox
            onChange={visualizationStore.setIsNormalized}
            checked={visualizationStore.isNormalized}
          >
            Normalization
          </Checkbox>
          {visualizationStore.isNormalized ? (
            <Select
              defaultValue={NormalizationCollector._normalizations.noNorm.id}
              onChange={visualizationStore.setNormalization}
            >
              {Object.values(NormalizationCollector.normalizations).map((item) => (
                <Option key={item.id}>
                  {item.label}
                </Option>
              ))}
            </Select>
          ) : null}

        </>
      ) : (
        <>
          <Item label="Neighbors number">
            <NeighborsSlider />
          </Item>
          <Item label="Min. distance">
            <MinDistanceSlider />
          </Item>
          <Item label="Spread">
            <SpreadSlider />
          </Item>
        </>
      )}

    </Form>
  );
});

export default DatasetManipulation;
