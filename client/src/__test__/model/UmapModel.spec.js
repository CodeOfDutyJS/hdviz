import { describe, it, expect } from '@jest/globals';
import { UMAP } from 'umap-js';
import DataModel from '../../model/DataModel';
import UmapModel from '../../model/VisualizationModels/UmapModel';

describe('#UmapModel', () => {
  const data = [{
    sepal_length: 5.1, petal_length: 1.4, petal_width: 0.2, sepal_width: 3.5, species: 'setosa', b: 'a',
  },
  {
    sepal_length: 4.9, petal_length: 1.4, petal_width: 0.2, sepal_width: 3, species: 'setosa', b: 'b',
  },
  {
    sepal_length: 4.7, petal_length: 1.3, petal_width: 0.2, sepal_width: 3.2, species: 'versicolor', b: 'c',
  },
  {
    sepal_length: 4.6, petal_length: 1.5, petal_width: 0.2, sepal_width: 3.1, species: 'virginica', b: 'd',
  }];

  const dataModel = new DataModel();
  dataModel.dataset = data;
  dataModel.features = ['sepal_length', 'sepal_width', 'petal_length', 'petal_width'];
  dataModel.targets = ['species', 'b'];
  const umapModel = new UmapModel();
  umapModel.addData(dataModel);

  const testUmap = new UMAP({
    nComponents: 3,
    minDist: 0.1,
    spread: 1,
    nNeighbors: 15,
  });

  describe('#getPreparedDataset', () => {
    const mData = [[
      -0.89, 1.02, -1.33,
    ],
    [
      -1.13, -0.12, -1.33,
    ],
    [
      -1.38, 0.33, -1.39,
    ],
    [
      -1.50, 0.10, -1.28,
    ]];

    it('expected the dataset prepared for the visualization', () => {
      // eslint-disable-next-line no-undef
      const spy = jest.spyOn(umapModel, 'Umap').mockImplementation(() => ({ points: mData }));
      const prepData = umapModel.getPreparedDataset({});
      expect(prepData).toEqual({
        points: [{
          x: -0.89,
          y: 1.02,
          z: -1.33,
          color: 'setosa',
          shape: 'a',
          description: {
            sepal_length: 5.1, sepal_width: 3.5, petal_length: 1.4, petal_width: 0.2, species: 'setosa', b: 'a',
          },
        }, {
          x: -1.13,
          y: -0.12,
          z: -1.33,
          color: 'setosa',
          shape: 'b',
          description: {
            sepal_length: 4.9, sepal_width: 3.0, petal_length: 1.4, petal_width: 0.2, species: 'setosa', b: 'b',
          },
        }, {
          x: -1.38,
          y: 0.33,
          z: -1.39,
          color: 'versicolor',
          shape: 'c',
          description: {
            sepal_length: 4.7, sepal_width: 3.2, petal_length: 1.3, petal_width: 0.2, species: 'versicolor', b: 'c',
          },
        }, {
          x: -1.50,
          y: 0.10,
          z: -1.28,
          color: 'virginica',
          shape: 'd',
          description: {
            sepal_length: 4.6, sepal_width: 3.1, petal_length: 1.5, petal_width: 0.2, species: 'virginica', b: 'd',
          },
        }],
        target1: ['setosa', 'versicolor', 'virginica'],
        target2: ['a', 'b', 'c', 'd'],
      });
      spy.mockRestore();
    });
  });
});
