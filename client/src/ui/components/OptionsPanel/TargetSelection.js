import React from 'react';
import { CompactPicker } from 'react-color';
import { Form, Select } from 'antd';

import { observer } from 'mobx-react-lite';
import { useStore2 } from '../../../store/RootStore';

const { Option } = Select;
const { Item } = Form;

const TargetSelection = observer(() => {
  const { modelStore, uiStore, visualizationStore } = useStore2();
  const setTargetColor1 = (color) => {
    visualizationStore.targetColor1 = color.hex;
    console.log(visualizationStore.targetColor1);
  };
  const setTargetColor2 = (color) => {
    visualizationStore.targetColor2 = color.hex;
    console.log(visualizationStore.targetColor2);
  };
  return (
    <>
      <Item
        label="Target"
        validateStatus={uiStore.maxTargets ? 'warning' : null}
        hasFeedback
        help={uiStore.maxTargets ? 'Max 2 target variables' : null}
      >
        <Select
          placeholder="Select target"
          mode="multiple"
          onChange={modelStore.setTargets}
          value={modelStore.targets}
        >
          {modelStore.columns.map((item) => <Option key={item.value}>{item.value}</Option>)}
        </Select>
      </Item>
      <Item
        label="Colore primo target"
      >
        { visualizationStore._visualization._visualizationSelected.id !== 'heatmap' ? <CompactPicker color={visualizationStore.targetColor1} onChange={setTargetColor1} /> : null }
      </Item>
      <Item
        label="Colore secondo target"
      >
        { visualizationStore._visualization._visualizationSelected.id !== 'heatmap' ? <CompactPicker color={visualizationStore.targetColor2} onChange={setTargetColor2} /> : null }
      </Item>
    </>
  );
});

export default TargetSelection;
