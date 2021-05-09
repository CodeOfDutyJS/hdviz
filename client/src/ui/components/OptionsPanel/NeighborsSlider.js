import { React, useState } from 'react';
import {
  Slider, InputNumber, Row, Col,
} from 'antd';
import Item from 'antd/lib/list/Item';
import { useStore } from '../../../store/RootStore';

const NeighborsSlider = () => {
  const [inputValue, setInputValue] = useState(0);
  const { visualizationStore } = useStore();
  const onChange = (value) => {
    setInputValue(value);
    visualizationStore.setNeighbors(value);
  };
  return (
    <Row aria-label="Neighbors number">
      <Col span={12}>
        <Slider
          min={5}
          max={100}
          onChange={onChange}
          value={typeof inputValue === 'number' ? inputValue : 0}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={5}
          max={100}
          style={{ margin: '0 16px' }}
          value={inputValue}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};

export default NeighborsSlider;
