import { React, useState } from 'react';
import {
  Slider, InputNumber, Row, Col,
} from 'antd';
import { useStore } from '../../../store/RootStore';

const MinDistanceSlider = () => {
  const [inputValue, setInputValue] = useState(0);
  const { visualizationStore } = useStore();
  const onChange = (value) => {
    if (Number.isNaN(value)) {
      return;
    }
    setInputValue(value);
    visualizationStore.setMinDistance(inputValue);
  };
  return (
    <Row>
      <Col span={12}>
        <Slider
          min={0}
          max={1}
          onChange={onChange}
          value={typeof inputValue === 'number' ? inputValue : 0}
          step={0.05}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={0}
          max={1}
          style={{ margin: '0 16px' }}
          step={0.05}
          value={inputValue}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};
export default MinDistanceSlider;
