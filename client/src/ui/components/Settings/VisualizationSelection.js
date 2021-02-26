import React, { useState, useEffect } from 'react';
import { Select, Form } from 'antd';

const { Option } = Select;
const { Item } = Form;

const VisualizationSelection = () => {
  const [visualizations, setVisualizations] = useState([
    { id: 'matrix', label: 'Scatter plot matrix', enabled: true },
    { id: 'heatmap', label: 'Heatmap', enabled: false },
    { id: 'correlation', label: 'Correlation Heatmap', enabled: false },
    { id: 'force', label: 'Force fields', enabled: false },
    { id: 'projection', label: 'Linear Projection', enabled: false },
    { id: 'parallel', label: 'Parallel Coordination', enabled: true },
  ]);

  const test = (a) => {
    const _visualizations = [...visualizations];
    _visualizations[_visualizations.findIndex((item) => item.id === 'force')].enabled = 'true';
    setVisualizations(_visualizations);
  };

  return (
    <Form>
      <Item label="Type" name="visualization" rules={[{ required: true, message: 'Please select a Visualization' }]}>
        <Select placeholder="Select visualization" onSelect={test}>
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
