import {
  describe,
  it,
  expect,
} from '@jest/globals';
import { DataModel } from '../../model';
import { HeatMapModel } from '../../model/VisualizationModels';
import { ClusteringType } from '../../utils/options';

describe('clustering', () => {
  const model = new DataModel();
  model.dataset = [
    {
      a: 'first', b: 0, c: 1, d: 2,
    },
    {
      a: 'second', b: 3, c: 5, d: 5,
    },
    {
      a: 'third', b: 10, c: 7, d: 8,
    },
    {
      a: 'fourth', b: 9, c: 12, d: 11,
    },
  ];
  model.features = ['b', 'c'];
  model.targets = ['a'];
  const testModel = new HeatMapModel();
  testModel.addData(model);
  it('should cluster alphabetically', () => {
    expect(testModel.getAlphabeticallySorted()).toStrictEqual({
      children: [
        {
          a: 'first', b: 0, c: 1,
        },
        {
          a: 'fourth',
          b:
      9,
          c:
      12,
        },
        {
          a: 'second',
          b:
      3,
          c:
      5,
        },
        {
          a: 'third',
          b:
      10,
          c:
      7,
        },
      ],
    });
  });
  it('should return a single linked cluster object', () => {
    expect(testModel.getLinkage(ClusteringType.SINGLE)).toStrictEqual({
      id: 'cluster2',
      children:
        [
          {
            id: 'cluster0',
            children: [
              {
                a: 'first',
                b: 0,
                c: 1,
              },
              {
                a: 'second',
                b: 3,
                c: 5,
              },
            ],
          },
          {
            id: 'cluster1',
            children: [
              {
                a: 'third',
                b: 10,
                c: 7,
              },
              {
                a: 'fourth',
                b: 9,
                c: 12,
              },
            ],
          },
        ],
    });
  });
  it('should return a complete linked cluster object', () => {
    expect(testModel.getLinkage(ClusteringType.COMPLETE)).toStrictEqual({
      id: 'cluster2',
      children:
        [
          {
            id: 'cluster0',
            children: [
              {
                a: 'first',
                b: 0,
                c: 1,
              },
              {
                a: 'second',
                b: 3,
                c: 5,
              },
            ],
          },
          {
            id: 'cluster1',
            children: [
              {
                a: 'third',
                b: 10,
                c: 7,
              },
              {
                a: 'fourth',
                b: 9,
                c: 12,
              },
            ],
          },
        ],
    });
  });
  it('should return a UPGMA linked cluster', () => {
    expect(testModel.getLinkage(ClusteringType.UPGMA)).toStrictEqual({
      id: 'cluster2',
      children:
        [
          {
            id: 'cluster0',
            children: [
              {
                a: 'first',
                b: 0,
                c: 1,
              },
              {
                a: 'second',
                b: 3,
                c: 5,
              },
            ],
          },
          {
            id: 'cluster1',
            children: [
              {
                a: 'third',
                b: 10,
                c: 7,
              },
              {
                a: 'fourth',
                b: 9,
                c: 12,
              },
            ],
          },
        ],
    });
  });
});

describe('Heatmap Model Helper Funcs', () => {
  const model = new DataModel();
  model.dataset = [
    {
      a: 'first', b: 0, c: 1, d: 2,
    },
    {
      a: 'second', b: 3, c: 5, d: 5,
    },
    {
      a: 'third', b: 10, c: 7, d: 8,
    },
    {
      a: 'fourth', b: 9, c: 12, d: 11,
    },
  ];
  model.features = ['b', 'c'];
  model.targets = ['a'];
  const testModel = new HeatMapModel();
  testModel.addData(model);
  it('should return a distance', () => {
    const a = { b: 3, c: 4 };
    const b = { b: 7, c: 5 };
    expect(testModel.distanceCalculator(a, b)).toBeCloseTo(4.1231, 4);
  });
  it('should return the correct matrix', () => {
    const expectedDistances = [
      [0, 5, 11.66, 14.21],
      [5, 0, 7.28, 9.22],
      [11.66, 7.28, 0, 5.10],
      [14.21, 9.22, 5.10, 0],
    ];
    testModel.getDistanceMatrix().forEach((row, z) => {
      row.distances.forEach((dist, i) => expect(dist).toBeCloseTo(expectedDistances[z][i], 2));
    });
  });
  it('should return the correct correlation matrix', () => {
    const expectedDistances = [
      [0, 0.56],
      [0.56, 0],
    ];
    testModel.getCorrelationMatrix().forEach((row, i) => {
      row.distances.forEach((dist, z) => {
        expect(dist).toBeCloseTo(expectedDistances[i][z], 2)
      });
    });
  });
});
