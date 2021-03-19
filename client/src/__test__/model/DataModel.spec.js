import { describe, it, expect } from '@jest/globals';
import DataModel from '../../model/DataModel';

describe('#DataModel', () => {
  const mockData = [
    {
      name: 'Pinco', color: 'blu', height: 1, width: 4,
    },
    {
      name: 'Pallo', color: 'green', height: 2, width: 5,
    },
    {
      name: 'Jinx', color: 'red', height: 3, width: 6,
    },
  ];
  const mockFeature = ['height'];
  const mockTarget = ['name', 'color'];

  describe('#getSelectedDataset', () => {
    const dataset = new DataModel();
    dataset.dataset = mockData;
    dataset.feature = mockFeature;
    dataset.target = mockTarget;
    const selectedData = dataset.getSelectedDataset();

    it('should return object with feature and target columns', () => {
      expect(selectedData).toEqual([
        {
          name: 'Pinco', color: 'blu', height: 1,
        },
        {
          name: 'Pallo', color: 'green', height: 2,
        },
        {
          name: 'Jinx', color: 'red', height: 3,
        },
      ]);
    });
    it('should return a deep copy of original dataset', () => {
      const original = mockData[0].color;
      mockData[0].color = 'white';
      expect(selectedData).not.toEqual(mockData);
      mockData[0].color = original;
    });
  });

  describe('#getFeatureColumns', () => {
    const dataset = new DataModel();
    dataset.dataset = mockData;
    dataset.feature = mockFeature;
    dataset.target = mockTarget;
    it('should return all feature columns with data', () => {
      expect(dataset.getFeatureColumns())
        .toEqual([
          {
            height: 1,
          },
          {
            height: 2,
          },
          {
            height: 3,
          },
        ]);
    });
    it('should return all target columns with data', () => {
      expect(dataset.getTargetColumns())
        .toEqual([
          {
            name: 'Pinco', color: 'blu',
          },
          {
            name: 'Pallo', color: 'green',
          },
          {
            name: 'Jinx', color: 'red',
          },
        ]);
    });
  });
});
