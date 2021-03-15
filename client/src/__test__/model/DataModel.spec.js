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
      ]);
    });
    it('should be a deep copy of original dataset', () => {
      mockData[0].color = 'white';
      expect(selectedData).not.toEqual(mockData);
    });
  });
});
