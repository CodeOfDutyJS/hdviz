import React, { useState, useEffect } from 'react';
import { Select, Form, Button } from 'antd';

import { useStore } from '../../../controller/ControllerProvider';
import { VisualizationType } from '../../../utils';

const { Option } = Select;
const { Item } = Form;

const VisualizationSelection = () => {
  const store = useStore();
  const [visualizations, setVisualizations] = useState([
    { id: VisualizationType.MATRIX, label: 'Scatter plot matrix', enabled: true },
    { id: VisualizationType.HEATMAP, label: 'Heatmap', enabled: false },
    { id: VisualizationType.CORRELATION, label: 'Correlation Heatmap', enabled: false },
    { id: VisualizationType.FORCE, label: 'Force fields', enabled: true },
    { id: VisualizationType.PROJECTION, label: 'Linear Projection', enabled: false },
    { id: VisualizationType.PARALLEL, label: 'Parallel Coordination', enabled: false },
  ]);

  const onVisualizationSelected = (_visualization) => {
    console.log(store.data);
    store.setVisualization(_visualization);
  };

  return (
    <Form>
      <Item label="Type" name="visualization" rules={[{ required: true, message: 'Please select a Visualization' }]}>
        <Select placeholder="Select visualization" onSelect={onVisualizationSelected}>
          {visualizations.map((item) => (
            <Option
              key={item.id}
              disabled={!item.enabled}
            >
              {item.label}
            </Option>
          ))}
        </Select>
      </Item>
    </Form>
  );
};

export default VisualizationSelection;
