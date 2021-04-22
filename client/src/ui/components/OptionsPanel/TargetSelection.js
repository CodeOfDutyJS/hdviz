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
  };
  const setTargetColor2 = (color) => {
    visualizationStore.targetColor2 = color.hex;
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

      { visualizationStore._visualization._visualizationSelected.id === 'heatmap'
        ? (
          <>
            <Item label="Colore inzio target">
              <CompactPicker color={visualizationStore.targetColor1} onChange={setTargetColor1} />
            </Item>
            <Item label="Colore fine target">
              <CompactPicker color={visualizationStore.targetColor2} onChange={setTargetColor2} />
            </Item>
          </>
        )
        : null}
    </>
  );
});

export default TargetSelection;
