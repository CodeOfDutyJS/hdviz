import React, { useState, useEffect } from 'react';

import { Form, Select, Checkbox } from 'antd';

import { observer } from 'mobx-react-lite';
import { useStore } from '../../../controller/ControllerProvider';
import VisualizationType, { DistanceType } from '../../../utils';

const { Option } = Select;
const { Item } = Form;

const DatasetManipulation = observer(() => {
  const store = useStore();
  const [header, setHeader] = useState([]);
  const [normalized, setNormalized] = useState(false);
  const [disanceMatrix, setDisanceMatrix] = useState(false);

  const testConnection = (sa) => {
    console.log(sa);
  };

  useEffect(() => {
    try {
      store.setColumnsFromModel();

      setHeader(store.columns);
    } catch (error) {
      console.log(error);
    }
  }, [store.data]);

  const onNormalizeCheckboxChanged = (e) => {
    setNormalized(e.target.checked);
  };

  const onMatrixCheckboxChanged = (e) => {
    setDisanceMatrix(e.target.checked);
  };

  const onFeaturesChanged = (_features) => {
    store.setFeatures(_features);
  };

  const onTargetChanged = (_target) => {
    if (_target.length > 2) {
      _target.pop();
    }
    store.setTarget(_target);
  };

  const onDistanceChanged = (_distance) => {
    store.setDistance(_distance);
  };

  return (
    <Form onFinish={testConnection}>
      <Item label="Features" name="features" rules={[{ required: true, message: 'Please select a Database' }]}>
        <Select placeholder="Database connection" mode="multiple" onChange={onFeaturesChanged}>
          {header.map((item, key) => <Option key={item}>{item}</Option>)}
        </Select>
      </Item>
      <Item
        label="Target"
        name="target"
        rules={[{
          required: false, message: 'Max 2 target variables', type: 'array', max: 2,
        }]}
      >
        <Select placeholder="Database connection" mode="multiple" onChange={onTargetChanged}>
          {header.map((item, key) => <Option key={item}>{item}</Option>)}
        </Select>
      </Item>
      <Item className="no-point" label={<Checkbox onChange={onNormalizeCheckboxChanged}>Normalize data</Checkbox>}>
        {normalized ? (
          <Select placeholder="Select what normalize">
            <Option key="1">Globale</Option>
            <Option key="2">Righe</Option>
            <Option key="3">Colonne</Option>
          </Select>
        ) : null}
      </Item>

      {store.getVisualizationSelected() === VisualizationType.FORCE
        ? (
          // eslint-disable-next-line max-len
          <Item className="no-point" label={<Checkbox onChange={onMatrixCheckboxChanged} checked={disanceMatrix}>Calculate Distance Matrix</Checkbox>}>
            {disanceMatrix ? (
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
