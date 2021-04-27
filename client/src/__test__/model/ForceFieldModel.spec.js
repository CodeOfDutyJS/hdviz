/* globals describe, expect, it */

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
  dataModel.feature = ['b', 'd'];
  dataModel.target = ['a'];
  const forceFieldModel = new ForceFieldModel(dataModel);

  describe('#distanceFn', () => {
    expect(forceFieldModel.dataModel.getFeatureColumns()).not.toBeNull();
    const distanceDataset = forceFieldModel.getPreparedDataset(distance.euclidean, 4, 6);
    it('should return a correctly formatted object', () => {
      expect(
        'nodes' in distanceDataset
        && 'links' in distanceDataset,
      ).toBeTruthy();
      expect(
        'id' in distanceDataset.nodes[0]
        && 'colore' in distanceDataset.nodes[0],
        && 'shape' in distanceDataset.nodes[0],
      ).toBeTruthy();
      expect(
        'source' in distanceDataset.links[0]
        && 'target' in distanceDataset.links[0]
        && 'value' in distanceDataset.links[0],
      ).toBeTruthy();
    });
    it('should calculate euclidean between nodes correctly', () => {
      expect(distanceDataset).toEqual({
        nodes: [
          {
            id: 0, colore: 'first', forma: undefined, features: JSON.stringify(mockDataset[0], ['b', 'd', 'a']),
          },
          {
            id: 1, colore: 'second', forma: undefined, features: JSON.stringify(mockDataset[1], ['b', 'd', 'a']),
          },
          {
            id: 2, colore: 'third', forma: undefined, features: JSON.stringify(mockDataset[2], ['b', 'd', 'a']),
          },
          {
            id: 3, colore: 'fourth', forma: undefined, features: JSON.stringify(mockDataset[3], ['b', 'd', 'a']),
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
      });
    });
  });
});
