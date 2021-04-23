import React, { useState } from 'react';

import {
  Form, Select, Checkbox,
} from 'antd';

import { observer } from 'mobx-react-lite';
<<<<<<< HEAD
import { useStore } from '../../../controller/ControllerProvider';
import { VisualizationType } from '../../../utils/visualizations';
import { DistanceType } from '../../../utils/options';
=======
import { VisualizationType, DistanceType } from '../../../utils/constant';
>>>>>>> cf0f0abf1c00f8e610c9e422027e442e46de8da0
import FeatureSelection from './FeatureSelection';
import TargetSelection from './TargetSelection';
import { useStore } from '../../../store/RootStore';

const { Option } = Select;
const { Item } = Form;

const DatasetManipulation = observer(() => {
  const { modelStore, visualizationStore } = useStore();
  const [normalized, setNormalized] = useState(false);
  const [isDistanceMatrix, setIsDistanceMatrix] = useState(true);

  const onNormalizeCheckboxChanged = (e) => {
    setNormalized(e.target.checked);
  };

  const onMatrixCheckboxChanged = (e) => {
    setIsDistanceMatrix(e.target.checked);
  };

  const onDistanceChanged = (_distance) => {
    modelStore.setDistance(_distance);
  };

  return (
    <Form>
      <FeatureSelection />
      <TargetSelection />

<<<<<<< HEAD
      {(visualizationStore.visualizationSelected === VisualizationType.FORCEFIELD || visualizationStore.visualizationSelected === VisualizationType.HEATMAP)
=======
      {visualizationStore.visualizationSelected?.options?.distance
>>>>>>> cf0f0abf1c00f8e610c9e422027e442e46de8da0
        ? (
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
