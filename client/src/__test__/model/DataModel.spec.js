/* globals describe, expect, it */
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
  const mockFeature = ['name', 'color'];
  const mockTarget = ['height'];

  describe('#getSelectedDataset', () => {
    const dataset = new DataModel(mockData);
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
        {
          name: 'Jinx', color: 'red', height: 8,
        },
      ]);
    });
    it('should be a deep copy of original dataset', () => {
      mockData[0].color = 'white';
      expect(selectedData).not.toEqual(mockData);
    });
  });
  describe('#Statistical Analysis', () => {
    const dataset = new DataModel(mockData);
    dataset.feature = mockTarget;
    dataset.target = mockFeature;

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
});
