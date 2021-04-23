import React from 'react';
import { Select, Form } from 'antd';

import { observer } from 'mobx-react-lite';
<<<<<<< HEAD
import { VisualizationType } from '../../../utils/visualizations';
import { useStore2 } from '../../../store/RootStore';
=======
import { useStore } from '../../../store/RootStore';
import VisualizationCollector from '../../../model/VisualizationsCollector';
>>>>>>> cf0f0abf1c00f8e610c9e422027e442e46de8da0

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
