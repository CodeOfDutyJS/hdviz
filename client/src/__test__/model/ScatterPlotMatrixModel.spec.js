import { expect, it } from '@jest/globals';
import { ScatterPlotMatrixModel } from '../../model/VisualizationModels/index';
import { DataModel } from '../../model/index';

jest.mock('../../model/DataModel');

describe('#getPreparedDataset', () => {
  const dataModel = new DataModel();
  const scatterPlotMatrix = new ScatterPlotMatrixModel();
  scatterPlotMatrix.addData(dataModel);
  const data = scatterPlotMatrix.getPreparedDataset({});

  it('should return object correctly', () => {
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('features');
    expect(data).toHaveProperty('targets');
    expect(data).toHaveProperty('selectedTarget');
  });
});
