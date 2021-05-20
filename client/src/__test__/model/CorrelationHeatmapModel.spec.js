import CorrelationHeatmapModel from '../../model/index';
import DataModel from '../../model/VisualizationModels/index';
import {expect} from "@jest/globals";
jest.mock('../../model/VisualizationModels/DataModel');

describe('CorrelationHeatmapModel', () => {
  it('should return the correct object', () => {
    const testModel = new CorrelationHeatmapModel(new DataModel());
    const data = CorrelationHeatmapModel.getPreparedDataset();
    expect(data).toHaveProperty('cluster');
    expect(data).toHaveProperty('color');
  });
});
