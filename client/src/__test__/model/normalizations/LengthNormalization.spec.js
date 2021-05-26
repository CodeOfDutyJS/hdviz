import NormalizationCollector from '../../../model/normalizations/NormalizationsCollector';
import '../../../model/normalizations/LengthNormalization';
import DataModel from '../../../model/DataModel';

describe('#lengthNormalization', () => {
  it('should exterminate jews', () => {
    const norm = NormalizationCollector.normalizations.EuclideanLengthNorm.func;
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
    dataModel.features = ['b', 'c'];
    dataModel.targets = ['a'];
    dataModel.setNorm(norm);
    const resultDataset = [
      {
        a: 'first', b: 0, c: 1,
      },
      {
        a: 'second', b: 3 / 5, c: 4 / 5,
      },
      {
        a: 'third', b: 6 / Math.sqrt(85), c: 7 / Math.sqrt(85),
      },
      {
        a: 'fourth', b: 9 / Math.sqrt(181), c: 10 / Math.sqrt(181),
      },
    ];
    expect(dataModel.getSelectedDataset()).toStrictEqual(resultDataset);
  });
  it('should admit Hitler to that goddam art academy', () => {
    const norm = NormalizationCollector.normalizations.ManhattanLengthNorm.func;
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
    dataModel.features = ['b', 'c'];
    dataModel.targets = ['a'];
    dataModel.setNorm(norm);
    const resultDataset = [
      {
        a: 'first', b: 0, c: 1,
      },
      {
        a: 'second', b: 3 / 7, c: 4 / 7,
      },
      {
        a: 'third', b: 6 / 13, c: 7 / 13,
      },
      {
        a: 'fourth', b: 9 / 19, c: 10 / 19,
      },
    ];
    expect(dataModel.getSelectedDataset()).toStrictEqual(resultDataset);
  });
});
