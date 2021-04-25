/* globals describe, expect, it */

import { transpose, mean, extent } from 'd3';
import { PCA } from 'ml-pca';
import DataModel from '../../model/DataModel';
import LinearProjectionModel from '../../model/VisualizationModels/LinearProjectionModel';

describe('#LinearProjectionModel', () => {
  const mockData = [
    {
      utility_name: 'Arizona',
      x1: 1.06,
      x2: 9.2,
      x3: 151,
      x4: 54.4,
      x5: 1.6,
      x6: 9077,
      x7: 0,
      x8: 0.628,
    },
    {
      utility_name: 'Boston',
      x1: 0.89,
      x2: 10.3,
      x3: 202,
      x4: 57.9,
      x5: 2.2,
      x6: 5088,
      x7: 25.3,
      x8: 1.555,
    },
    {
      utility_name: 'Central',
      x1: 1.43,
      x2: 15.4,
      x3: 113,
      x4: 53,
      x5: 3.4,
      x6: 9212,
      x7: 0,
      x8: 1.058,
    },
    {
      utility_name: 'Common',
      x1: 1.02,
      x2: 11.2,
      x3: 168,
      x4: 56,
      x5: 0.3,
      x6: 6423,
      x7: 34.3,
      x8: 0.7,
    },
    {
      utility_name: 'Consolid',
      x1: 1.49,
      x2: 8.8,
      x3: 192,
      x4: 51.2,
      x5: 1,
      x6: 3300,
      x7: 15.6,
      x8: 2.044,
    },
    {
      utility_name: 'Florida',
      x1: 1.32,
      x2: 13.5,
      x3: 111,
      x4: 60,
      x5: -2.2,
      x6: 11127,
      x7: 22.5,
      x8: 1.241,
    },
    {
      utility_name: 'Hawaiian',
      x1: 1.22,
      x2: 12.2,
      x3: 175,
      x4: 67.6,
      x5: 2.2,
      x6: 7642,
      x7: 0,
      x8: 1.652,
    },
    {
      utility_name: 'Idaho',
      x1: 1.1,
      x2: 9.2,
      x3: 245,
      x4: 57,
      x5: 3.3,
      x6: 13082,
      x7: 0,
      x8: 0.309,
    },
    {
      utility_name: 'Kentucky',
      x1: 1.34,
      x2: 13,
      x3: 168,
      x4: 60.4,
      x5: 7.2,
      x6: 8406,
      x7: 0,
      x8: 0.862,
    },
    {
      utility_name: 'Madison',
      x1: 1.12,
      x2: 12.4,
      x3: 197,
      x4: 53,
      x5: 2.7,
      x6: 6455,
      x7: 39.2,
      x8: 0.623,
    },
    {
      utility_name: 'Nevada',
      x1: 0.75,
      x2: 7.5,
      x3: 173,
      x4: 51.5,
      x5: 6.5,
      x6: 17441,
      x7: 0,
      x8: 0.768,
    },
    {
      utility_name: 'NewEngland',
      x1: 1.13,
      x2: 10.9,
      x3: 178,
      x4: 62,
      x5: 3.7,
      x6: 6154,
      x7: 0,
      x8: 1.897,
    },
    {
      utility_name: 'Northern',
      x1: 1.15,
      x2: 12.7,
      x3: 199,
      x4: 53.7,
      x5: 6.4,
      x6: 7179,
      x7: 50.2,
      x8: 0.527,
    },
    {
      utility_name: 'Oklahoma',
      x1: 1.09,
      x2: 12,
      x3: 96,
      x4: 49.8,
      x5: 1.4,
      x6: 9673,
      x7: 0,
      x8: 0.588,
    },
    {
      utility_name: 'Pacific',
      x1: 0.96,
      x2: 7.6,
      x3: 164,
      x4: 62.2,
      x5: -0.1,
      x6: 6468,
      x7: 0.9,
      x8: 1.4,
    },
    {
      utility_name: 'Puget',
      x1: 1.16,
      x2: 9.9,
      x3: 252,
      x4: 56,
      x5: 9.2,
      x6: 15991,
      x7: 0,
      x8: 0.62,
    },
    {
      utility_name: 'SanDiego',
      x1: 0.76,
      x2: 6.4,
      x3: 136,
      x4: 61.9,
      x5: 9,
      x6: 5714,
      x7: 8.3,
      x8: 1.92,
    },
    {
      utility_name: 'Southern',
      x1: 1.05,
      x2: 12.6,
      x3: 150,
      x4: 56.7,
      x5: 2.7,
      x6: 10140,
      x7: 0,
      x8: 1.108,
    },
    {
      utility_name: 'Texas',
      x1: 1.16,
      x2: 11.7,
      x3: 104,
      x4: 54,
      x5: -2.1,
      x6: 13507,
      x7: 0,
      x8: 0.636,
    },
    {
      utility_name: 'Wisconsin',
      x1: 1.2,
      x2: 11.8,
      x3: 148,
      x4: 59.9,
      x5: 3.5,
      x6: 7287,
      x7: 41.1,
      x8: 0.702,
    },
    {
      utility_name: 'United',
      x1: 1.04,
      x2: 8.6,
      x3: 204,
      x4: 61,
      x5: 3.5,
      x6: 6650,
      x7: 0,
      x8: 2.116,
    },
    {
      utility_name: 'Virginia',
      x1: 1.07,
      x2: 9.3,
      x3: 174,
      x4: 54.3,
      x5: 5.9,
      x6: 10093,
      x7: 26.6,
      x8: 1.306,
    },
  ];

  const dataModel = new DataModel();
  dataModel.dataset = mockData;
  dataModel.features = ['x1', 'x2', 'x3', 'x4', 'x5', 'x6', 'x7', 'x8'];
  dataModel.targets = ['utility_name'];
  const linearProjectionModel = new LinearProjectionModel();
  linearProjectionModel.addData(dataModel);

  describe('#pca', () => {
    const projection = linearProjectionModel.pca({ scale: true });
    const expected = [[-0.146, -0.706, -0.756, 0.746, -0.401, -0.278, -0.654, -0.512],
      [1.077, 0.901, 0.997, 0.902, 0.104, -0.431, -0.213, 0.873], [-2.567, 0.288, -0.765, -1.066, -0.370, 1.297, -0.195, 0.325],
      [-0.719, 0.225, 1.054, 1.264, 0.423, -0.699, -0.269, 0.044], [-0.225, 1.852, 0.783, -0.061, -2.909, 0.115, 0.322, -0.387],
      [-2.164, 1.189, -0.852, 0.075, 0.681, -0.586, 1.180, -0.018], [0.469, 1.929, -0.812, -1.476, 0.994, -0.628, 0.068, 0.085],
      [0.661, -1.930, 0.097, -0.908, -0.299, -1.598, -0.404, -0.268], [-0.468, 0.132, -0.021, -1.960, 0.506, 0.759, -0.570, -0.443],
      [-1.037, -0.256, 2.001, 0.521, -0.020, -0.292, -0.323, 0.322], [1.549, -3.254, -0.954, 0.854, -0.075, 0.358, 0.606, 0.302],
      [1.022, 1.586, -0.457, -0.749, 0.016, 0.147, -0.120, 0.378], [-0.881, -0.644, 2.794, 0.036, 0.486, 0.415, 0.003, 0.049],
      [-1.751, -0.871, -1.198, 1.127, -0.357, 0.825, -0.639, 0.038], [1.420, 1.111, -1.002, 0.888, 0.102, -1.002, -0.336, -0.450],
      [1.148, -2.670, 0.437, -2.106, -0.270, -0.200, 0.298, -0.026], [3.240, 0.733, -0.329, 0.976, 0.776, 1.659, -0.021, -0.465],
      [-0.448, -0.166, -0.853, -0.118, 0.330, 0.209, -0.255, 0.692], [-1.932, -0.730, -1.911, 0.797, -0.031, -0.522, 0.310, -0.116],
      [-0.938, 0.514, 1.293, 0.227, 1.146, 0.034, 0.311, -0.753], [2.082, 1.323, -0.353, -0.338, -0.561, -0.232, 0.132, 0.408],
      [0.609, -0.558, 0.811, 0.366, -0.272, 0.649, 0.770, -0.081]];
    const expectedAxis = [[-0.445, 0.232, 0.067, -0.555, -0.400, 0.006, 0.205, -0.481],
      [-0.571, 0.100, 0.071, -0.332, 0.335, 0.133, -0.150, 0.628],
      [0.348, -0.161, 0.467, -0.409, -0.268, -0.537, 0.117, 0.302],
      [0.288, 0.409, -0.142, -0.333, 0.680, -0.298, 0.064, -0.247],
      [0.355, -0.282, 0.281, -0.391, 0.162, 0.719, -0.051, -0.122],
      [-0.053, -0.603, -0.331, -0.190, 0.131, -0.149, 0.660, 0.103],
      [-0.167, 0.085, 0.737, 0.333, 0.249, -0.026, 0.488, -0.084],
      [0.335, 0.539, -0.134, -0.039, -0.292, 0.252, 0.489, 0.433]];

    it('expect to return the projected points', () => {
      projection.points.forEach((x, i) => {
        x.forEach((y, j) => {
          expect(Math.abs(y - expected[i][j]) < 0.1 || Math.abs(y + expected[i][j]) < 0.1).toBeTruthy();
        });
      });
    });
    it('expect to return the projected axis', () => {
      projection.axis.forEach((x, i) => {
        x.forEach((y, j) => {
          expect(Math.abs(y - expectedAxis[i][j]) < 0.1 || Math.abs(y + expectedAxis[i][j]) < 0.1).toBeTruthy();
        });
      });
    });
  });

  describe('#getPreparedDataset', () => {
    const preparedDataset = linearProjectionModel.getPreparedDataset();
    const expectedDataset = {
      points: [{
        x: -0.146, y: -0.706, color: 'Arizona', size: null,
      },
      {
        x: 1.077, y: 0.901, color: 'Boston', size: null,
      },
      {
        x: -2.567, y: 0.288, color: 'Central', size: null,
      },
      {
        x: -0.719, y: 0.225, color: 'Common', size: null,
      },
      {
        x: -0.225, y: 1.852, color: 'Consolid', size: null,
      },
      {
        x: -2.164, y: 1.189, color: 'Florida', size: null,
      },
      {
        x: 0.469, y: 1.929, color: 'Hawaiian', size: null,
      },
      {
        x: 0.661, y: -1.930, color: 'Idaho', size: null,
      },
      {
        x: -0.468, y: 0.132, color: 'Kentucky', size: null,
      },
      {
        x: -1.037, y: -0.256, color: 'Madison', size: null,
      },
      {
        x: 1.549, y: -3.254, color: 'Nevada', size: null,
      },
      {
        x: 1.022, y: 1.586, color: 'NewEngland', size: null,
      },
      {
        x: -0.881, y: -0.644, color: 'Northern', size: null,
      },
      {
        x: -1.751, y: -0.871, color: 'Oklahoma', size: null,
      },
      {
        x: 1.420, y: 1.111, color: 'Pacific', size: null,
      },
      {
        x: 1.148, y: -2.670, color: 'Puget', size: null,
      },
      {
        x: 3.240, y: 0.733, color: 'SanDiego', size: null,
      },
      {
        x: -0.448, y: -0.166, color: 'Southern', size: null,
      },
      {
        x: -1.932, y: -0.730, color: 'Texas', size: null,
      },
      {
        x: -0.938, y: 0.514, color: 'Wisconsin', size: null,
      },
      {
        x: 2.082, y: 1.323, color: 'United', size: null,
      },
      {
        x: 0.609, y: -0.558, color: 'Virginia', size: null,
      }],
      axis: [{ x: -0.445, y: 0.232, label: 'x1' },
        { x: -0.571, y: 0.100, label: 'x2' },
        { x: 0.348, y: -0.161, label: 'x3' },
        { x: 0.288, y: 0.409, label: 'x4' },
        { x: 0.355, y: -0.282, label: 'x5' },
        { x: -0.053, y: -0.603, label: 'x6' },
        { x: -0.167, y: 0.085, label: 'x7' },
        { x: 0.335, y: 0.539, label: 'x8' }],
      rangeX: [-2.567, 3.240],
      rangeY: [-3.254, 1.929],
      mean: { meanx: 0, meany: 0 },
    };

    it('expect the correct coordinates for display the points', () => {
      preparedDataset.points.forEach((p, i) => {
        expect(Math.abs(p.x - expectedDataset.points[i].x) < 0.1 || Math.abs(p.x + expectedDataset.points[i].x) < 0.1)
          .toBeTruthy();
        expect(Math.abs(p.y - expectedDataset.points[i].y) < 0.1 || Math.abs(p.y + expectedDataset.points[i].y) < 0.1)
          .toBeTruthy();
        expect(p.color).toEqual(expectedDataset.points[i].color);
        expect(p.size).toEqual(expectedDataset.points[i].size);
      });
    });

    it('expect the correct coordinates for display the axis', () => {
      preparedDataset.axis.forEach((a, i) => {
        expect(Math.abs(a.x - expectedDataset.axis[i].x) < 0.1 || Math.abs(a.x + expectedDataset.axis[i].x) < 0.1)
          .toBeTruthy();
        expect(Math.abs(a.y - expectedDataset.axis[i].y) < 0.1 || Math.abs(a.y + expectedDataset.axis[i].y) < 0.1)
          .toBeTruthy();
        expect(a.label).toEqual(expectedDataset.axis[i].label);
      });
    });

    it('expect correct target labels', () => {
      expect(preparedDataset.target).toEqual(['Arizona', 'Boston', 'Central', 'Common', 'Consolid', 'Florida', 'Hawaiian', 'Idaho', 'Kentucky',
        'Madison', 'Nevada', 'NewEngland', 'Northern', 'Oklahoma', 'Pacific', 'Puget', 'SanDiego', 'Southern', 'Texas', 'Wisconsin', 'United', 'Virginia']);
    });
  });
});
