import { describe, test, expect } from '@jest/globals';
import { distance } from 'ml-distance';
import DataModel from '../../model/DataModel';
import ForceFieldModel from '../../model/VisualizationModels/ForceFieldModel';

const { euclidean } = distance;

describe('#ForceFieldModel', () => {
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
  const forceFieldModel = new ForceFieldModel();
  forceFieldModel.addData(dataModel);

  describe('#distanceFn', () => {
    expect(forceFieldModel.dataModel.getFeatureColumns()).not.toBeNull();
    const distanceDataset = forceFieldModel.getPreparedDataset({ distanceFn: distance.euclidean, maxNodes: 4, maxLinks: 6 });
    test('should return a correctly formatted object', () => {
      expect(
        'nodes' in distanceDataset
        && 'links' in distanceDataset,
      ).toBeTruthy();
      expect(
        'features' in distanceDataset.nodes[0]
        && 'color' in distanceDataset.nodes[0]
        && 'shape' in distanceDataset.nodes[0],
      ).toBeTruthy();
      expect(
        'source' in distanceDataset.links[0]
        && 'target' in distanceDataset.links[0]
        && 'value' in distanceDataset.links[0],
      ).toBeTruthy();
    });
    test('should calculate euclidean between nodes correctly', () => {
      expect(distanceDataset).toEqual({
        nodes: [
          {
            color: 'first', shape: null, features: JSON.stringify(mockDataset[0], ['b', 'd', 'a']),
          },
          {
            color: 'second', shape: null, features: JSON.stringify(mockDataset[1], ['b', 'd', 'a']),
          },
          {
            color: 'third', shape: null, features: JSON.stringify(mockDataset[2], ['b', 'd', 'a']),
          },
          {
            color: 'fourth', shape: null, features: JSON.stringify(mockDataset[3], ['b', 'd', 'a']),
          },
        ],
        links: [
          { source: 0, target: 1, value: euclidean([0, 2], [3, 5]) },
          { source: 0, target: 2, value: euclidean([0, 2], [6, 8]) },
          { source: 0, target: 3, value: euclidean([0, 2], [9, 11]) },
          { source: 1, target: 2, value: euclidean([3, 5], [6, 8]) },
          { source: 1, target: 3, value: euclidean([3, 5], [9, 11]) },
          { source: 2, target: 3, value: euclidean([6, 8], [9, 11]) },
        ],
        selectedTarget: [
          { a: 'first' },
          { a: 'second' },
          { a: 'third' },
          { a: 'fourth' },
        ],
      });
    });
  });
});
