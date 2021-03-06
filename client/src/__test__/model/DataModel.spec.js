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
    {
      name: 'Jinx', color: 'red', height: 8, width: 6,
    },
  ];
  const mockFeature = ['height'];
  const mockTarget = ['name', 'color'];

  describe('#getSelectedDataset', () => {
    const dataset = new DataModel();
    dataset.dataset = mockData;
    dataset.features = mockFeature;
    dataset.targets = mockTarget;
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
        {
          name: 'Jinx', color: 'red', height: 8,
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

  describe('#sampling', () => {
    const dataset = new DataModel();
    dataset.dataset = mockData;
    dataset.features = mockFeature;
    dataset.targets = mockTarget;
    const selectedData = dataset.getSelectedDataset();
    it('stratified sampling', () => {
      expect(dataset.stratifiedSampling(selectedData, 'color', 2).length).toStrictEqual(2);
    });
    it('kthSampling', () => {
      expect(dataset.kthSampling(selectedData, 2).length).toStrictEqual(2);
    });
  });
  describe('#getFeatureColumns', () => {
    const dataset = new DataModel();
    dataset.dataset = mockData;
    dataset.features = mockFeature;
    dataset.targets = mockTarget;
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
          {
            height: 8,
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
          {
            name: 'Jinx', color: 'red',
          },
        ]);
    });
  });
  /*
  commmentato perchè queste funzioni sono state spostate da
  datamodel, ma potrebbero essere utili per altri test

  describe('#Statistical Analysis', () => {
    const dataset = new DataModel();
    dataset.dataset = mockData;
    dataset.features = mockTarget;
    dataset.targets = mockFeature;

    it('should return the mean', () => {
      expect(dataset.getMean('height')).toEqual(3.5);
    });

    it('should return the Population Variance', () => {
      expect(dataset.getPopulationVariance('height').toPrecision(3)).toEqual('7.25');
    });

    it('should return the Sample Variance', () => {
      expect(dataset.getSampleVariance('height').toPrecision(3)).toEqual('9.67');
    });

    it('should return the Sample Deviation', () => {
      expect(dataset.getSampleDeviation('height').toPrecision(3)).toEqual('3.11');
    });

    it('should return the Population Deviation', () => {
      expect(dataset.getPopulationDeviation('height').toPrecision(3)).toEqual('2.69');
    });
  });
  */
});
