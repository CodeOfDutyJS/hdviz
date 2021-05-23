import {
  describe, expect, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import { distance } from 'ml-distance';
import RootStore from '../../store/RootStore';
import '../../model/VisualizationModels/ParallelCoordinatesModel';

const rootStore = new RootStore();
const { visualizationStore } = rootStore;

describe('#(Integration) Check Parallel Coordinates Distance Matrix', () => {
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
    visualizationStore.setVisualizationSelected('parallel');
    visualizationStore.setDistance('euclidean');
    rootStore.modelStore.setFeatures(['b', 'd']);
    rootStore.modelStore.setTargets(['a']);
    expect(visualizationStore._visualization._visualizationSelected.id).toBe('parallel');
    expect(visualizationStore._visualization._options).toStrictEqual({ distanceFn: distance.euclidean });
    expect(rootStore.modelStore.features).toStrictEqual(['b', 'd']);
    expect(rootStore.modelStore.targets).toStrictEqual(['a']);
  });

  test('verify matrix', () => {
    // calcolare matrice di distanza
    expect(visualizationStore._visualization.getPreparedDataset(rootStore.modelStore.data)).toStrictEqual({
      features: [
        'b',
        'd',
      ],
      selectedData: [
        {
          a: 'first',
          b: 0,
          d: 2,
        },
        {
          a: 'second',
          b: 3,
          d: 5,
        },
        {
          a: 'third',
          b: 6,
          d: 8,
        },
        {
          a: 'fourth',
          b: 9,
          d: 11,
        },
      ],
      selectedTarget: [
        {
          a: 'first',
        },
        {
          a: 'second',
        },
        {
          a: 'third',
        },
        {
          a: 'fourth',
        },
      ],
      targets: [
        'a',
      ],
    });
  });
});
