import React from 'react';
import { Select, Form } from 'antd';

import { observer } from 'mobx-react-lite';
import VisualizationCollector from '../../../model/VisualizationsCollector';
import { useStore } from '../../../store/RootStore';

const { Option } = Select;
const { Item } = Form;

const VisualizationSelection = observer(() => {
  const { visualizationStore } = useStore();

  return (
    <Form>
      <Item
        label="Type"
        rules={[{ required: true, message: 'Please select a Visualization' }]}
      >
        <Select
          placeholder="Select visualization"
          onSelect={visualizationStore.setVisualizationSelected}
          value={visualizationStore.visualizationSelected?.id}
        >
          {Object.values(VisualizationCollector.visualizations).map((item) => (
            <Option key={item.id}>
              {item.label}
            </Option>
          ))}
        </Select>
      </Item>
    </Form>
  );
});

export default VisualizationSelection;
