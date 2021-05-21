import CorrelationHeatmapModel from '../../model/index';
import DataModel from '../../model/VisualizationModels/index';

describe('CorrelationHeatmapModel', () => {
  it('should return the correct object', () => {
    const dataModel = new DataModel();
    const testModel = new CorrelationHeatmapModel();
    testModel.addData(dataModel);
    const data = CorrelationHeatmapModel.getPreparedDataset({});
    expect(data).toHaveProperty('cluster');
    expect(data).toHaveProperty('color');
  });
});
