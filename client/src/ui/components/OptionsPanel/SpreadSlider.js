import { React, useState } from 'react';
import {
  Slider, InputNumber, Row, Col,
} from 'antd';
import { useStore } from '../../../store/RootStore';

const SpreadSlider = () => {
  const [inputValue, setInputValue] = useState(1);
  const { visualizationStore } = useStore();
  const onChange = (value) => {
    if (Number.isNaN(value)) {
      return;
    }
    setInputValue(value);
    visualizationStore.setSpread(inputValue);
  };
  return (
    <Row>
      <Col span={12}>
        <Slider
          min={0.5}
          max={10}
          onChange={onChange}
          value={typeof inputValue === 'number' ? inputValue : 0.5}
          step={0.5}
        />
      </Col>
      <Col span={4}>
        <InputNumber
          min={0.5}
          max={10}
          style={{ margin: '0 16px' }}
          step={0.5}
          value={inputValue}
          onChange={onChange}
        />
      </Col>
    </Row>
  );
};
export default SpreadSlider;
