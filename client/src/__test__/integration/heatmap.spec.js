import {
  describe, expect, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import { distance } from 'ml-distance';
import RootStore from '../../store/RootStore';
import '../../model/VisualizationModels/HeatMapModel';

const rootStore = new RootStore();
const { visualizationStore } = rootStore;

describe('#(Integration) Check Heatmap Distance Matrix', () => {
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
    visualizationStore.setVisualizationSelected('heatmap');
    visualizationStore.setDistance('euclidean');
    rootStore.modelStore.setFeatures(['b', 'd']);
    rootStore.modelStore.setTargets(['a']);
    expect(visualizationStore._visualization._visualizationSelected.id).toBe('heatmap');
    expect(visualizationStore._visualization._options).toStrictEqual({ distanceFn: distance.euclidean });
    expect(rootStore.modelStore.features).toStrictEqual(['b', 'd']);
    expect(rootStore.modelStore.targets).toStrictEqual(['a']);
  });

  test('verify matrix', () => {
    // calcolare matrice di distanza
    expect(visualizationStore._visualization.getPreparedDataset(rootStore.modelStore.data)).toStrictEqual({
      cluster: {
        children: [
          {
            children: [
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
            ],
            id: 'cluster0',
          },
          {
            children: [
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
            id: 'cluster1',
          },
        ],
        id: 'cluster2',
      },
      clusterCols: {
        children: [
          {
            b: 1,
            d: 1,
            id: 'b',
          },
          {
            b: 1,
            d: 1,
            id: 'd',
          },
        ],
        id: 'cluster0',
      },
      color: [
        undefined,
        '#FFF',
        undefined,
      ],
      heatmapRange: [
        undefined,
        undefined,
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
      targetCols: [
        'a',
      ],
    });
  });
});
