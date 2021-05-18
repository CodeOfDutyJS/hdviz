import { expect, it } from '@jest/globals';
import { ParallelCoordinatesModel } from '../../model/VisualizationModels/index';
import { DataModel } from '../../model/index';

jest.mock('../../model/DataModel');

describe('#getPreparedDataset', () => {
  const dataModel = new DataModel();
  const parallelCoordinates = new ParallelCoordinatesModel();
  parallelCoordinates.addData(dataModel);
  const data = parallelCoordinates.getPreparedDataset();

  it('should return object correctly', () => {
    expect(data).toHaveProperty('selectedData');
    expect(data).toHaveProperty('features');
    expect(data).toHaveProperty('targets');
    expect(data).toHaveProperty('selectedTarget');
  });
});
