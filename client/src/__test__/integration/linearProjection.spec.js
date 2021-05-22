import {
  describe, expect, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import { distance } from 'ml-distance';
import RootStore from '../../store/RootStore';
import '../../model/VisualizationModels/LinearProjectionModel';

const rootStore = new RootStore();
const { visualizationStore } = rootStore;

describe('#(Integration) Check Linear Projection Distance Matrix', () => {
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
    visualizationStore.setVisualizationSelected('linear');
    visualizationStore.setDistance('euclidean');
    rootStore.modelStore.setFeatures(['b', 'd']);
    rootStore.modelStore.setTargets(['a']);
    expect(visualizationStore._visualization._visualizationSelected.id).toBe('linear');
    expect(visualizationStore._visualization._options).toStrictEqual({ distanceFn: distance.euclidean });
    expect(rootStore.modelStore.features).toStrictEqual(['b', 'd']);
    expect(rootStore.modelStore.targets).toStrictEqual(['a']);
  });

  test('verify matrix', () => {
    // calcolare matrice di distanza
    expect(visualizationStore._visualization.getPreparedDataset(rootStore.modelStore.data)).toStrictEqual({
      axis: [
        [
          {
            x: 0,
            y: 0,
            z: 0,
          },
          {
            x: 0.7071067811865475,
            y: 0.7071067811865476,
            z: undefined,
          },
        ],
        [
          {
            x: 0,
            y: 0,
            z: 0,
          },
          {
            x: 0.7071067811865476,
            y: -0.7071067811865475,
            z: undefined,
          },
        ],
      ],
      feature: [
        'b',
        'd',
      ],
      points: [
        {
          color: 'first',
          shape: null,
          x: -1.6431676725154984,
          y: -1.1102230246251565e-16,
          z: undefined,
        },
        {
          color: 'second',
          shape: null,
          x: -0.5477225575051661,
          y: -5.551115123125783e-17,
          z: undefined,
        },
        {
          color: 'third',
          shape: null,
          x: 0.5477225575051661,
          y: 5.551115123125783e-17,
          z: undefined,
        },
        {
          color: 'fourth',
          shape: null,
          x: 1.6431676725154984,
          y: 1.1102230246251565e-16,
          z: undefined,
        },
      ],
      target: [
        'first',
        'second',
        'third',
        'fourth',
      ],
    });
  });
});
