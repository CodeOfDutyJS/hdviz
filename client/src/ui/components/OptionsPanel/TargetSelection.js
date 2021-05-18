import React from 'react';
import { CompactPicker } from 'react-color';
import { Form, Select, InputNumber } from 'antd';

import { observer } from 'mobx-react-lite';
import { useStore } from '../../../store/RootStore';

const { Option } = Select;
const { Item } = Form;

const TargetSelection = observer(() => {
  const { modelStore, uiStore, visualizationStore } = useStore();

  return (
    <>
      <Item
        label="Target"
        validateStatus={uiStore.maxTargets ? 'warning' : null}
        hasFeedback
        // eslint-disable-next-line
        help={uiStore.maxTargets ? 'Max 2 target variables' : (  visualizationStore.visualizationSelected?.id !== 'heatmap' ? 'First target is color, second is shape.' : null )}
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

      { visualizationStore.visualizationSelected?.options?.color === true
        ? (
          <>
            <Item label="Initial range color">
              <CompactPicker color={visualizationStore.targetColor1} onChange={visualizationStore.setInitialHeatmapColor} />
            </Item>
            <Item label="Final range color">
              <CompactPicker color={visualizationStore.targetColor2} onChange={visualizationStore.setFinalHeatmapColor} />
            </Item>
          </>
        ) : null}
      { visualizationStore.visualizationSelected?.options?.range === true
        ? (
          <>
            <Item label="Heatmap visualization range" className="range-number">
              <InputNumber className="first-range-number" onChange={visualizationStore.setPrimoRangeHeatmap} />
              to
              <InputNumber className="second-range-number" onChange={visualizationStore.setSecondoRangeHeatmap} />
            </Item>
          </>
        ) : null}
    </>
  );
});

export default TargetSelection;