import {
  describe, expect, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import { distance } from 'ml-distance';
import RootStore from '../../store/RootStore';
import '../../model/VisualizationModels/ForceFieldModel';

const rootStore = new RootStore();
const { visualizationStore } = rootStore;

describe('#(Integration) Check Distance Matrix', () => {
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

  test('upload data', () => {
    rootStore.modelStore.setDataset(mockDataset);
    expect(rootStore.modelStore.dataModel.dataset).toStrictEqual(mockDataset);
  });

  test('select settings', () => {
    visualizationStore.setVisualizationSelected('force');
    visualizationStore.setDistance('euclidean');
    rootStore.modelStore.setFeatures(['b', 'd']);
    rootStore.modelStore.setTargets(['a']);
    expect(visualizationStore._visualization._visualizationSelected.id).toBe('force');
    expect(visualizationStore._visualization._options).toStrictEqual({ distanceFn: distance.euclidean });
    expect(rootStore.modelStore.features).toStrictEqual(['b', 'd']);
    expect(rootStore.modelStore.targets).toStrictEqual(['a']);
  });

  test('verify matrix', () => {
    // calcolare matrice di distanza
    expect(visualizationStore._visualization.getPreparedDataset(rootStore.modelStore.data)).toStrictEqual({
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
        { source: 0, target: 1, value: distance.euclidean([0, 2], [3, 5]) },
        { source: 0, target: 2, value: distance.euclidean([0, 2], [6, 8]) },
        { source: 0, target: 3, value: distance.euclidean([0, 2], [9, 11]) },
        { source: 1, target: 2, value: distance.euclidean([3, 5], [6, 8]) },
        { source: 1, target: 3, value: distance.euclidean([3, 5], [9, 11]) },
        { source: 2, target: 3, value: distance.euclidean([6, 8], [9, 11]) },
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
