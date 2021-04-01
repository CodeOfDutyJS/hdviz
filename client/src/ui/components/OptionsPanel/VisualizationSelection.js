import React, { useState, useEffect } from 'react';
import { Select, Form, Button } from 'antd';

import { useStore } from '../../../controller/ControllerProvider';
import { VisualizationType } from '../../../utils';

const { Option } = Select;
const { Item } = Form;

const VisualizationSelection = () => {
  const store = useStore();
  const [visualizations, setVisualizations] = useState([
    { id: VisualizationType.SCATTER_PLOT_MATRIX, label: 'Scatter plot matrix', enabled: true },
    { id: VisualizationType.HEATMAP, label: 'Heatmap', enabled: true },
    { id: VisualizationType.CORRELATION_HEATMAP, label: 'Correlation Heatmap', enabled: true },
    { id: VisualizationType.FORCEFIELD, label: 'Force fields', enabled: true },
    { id: VisualizationType.LINEAR_PROJECTION, label: 'Linear Projection', enabled: true },
    { id: VisualizationType.PARALLEL_COORDINATES, label: 'Parallel Coordinates', enabled: false },
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
