import CorrelationHeatmapModel from '../../model/VisualizationModels/CorrelationHeatmapModel';
import DataModel from '../../model/DataModel';

describe('CorrelationHeatmapModel', () => {
  it('should return the correct object', () => {
    const mockDataset = [
      {
        a: 'first', b: 0, c: 1, d: 2,
      },
      {
        a: 'second', b: 3, c: 4, d: 5,
      },
      {
        a: 'third', b: 6, c: 7, d: 8,
      },
      {
        a: 'fourth', b: 9, c: 10, d: 11,
      },
    ];

    const dataModel = new DataModel();
    dataModel.dataset = mockDataset;
    dataModel.features = ['b', 'd'];
    dataModel.targets = ['a'];
    const testModel = new CorrelationHeatmapModel();
    testModel.addData(dataModel);
    const data = testModel.getPreparedDataset({ initialColor: 'fff', finalColor: 'fff' });
    expect(data).toHaveProperty('cluster');
    expect(data).toHaveProperty('color');
  });
});
