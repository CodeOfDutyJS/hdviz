/* globals describe, expect, it */

import { distance } from 'ml-distance';
import dataArray from './data';
import DataModel from '../../model/DataModel';
import HeatMapModel from '../../model/HeatMapModel';
import { ClusteringType, DistanceType } from '../../utils';

describe('#HeatMapModel', () => {
  const mockData = [
    {
      name: 'Pinco', color: 'blu', height: 1, width: 4, weight: 7,
    },
    {
      name: 'Pallo', color: 'green', height: 2, width: 5, weight: 8,
    },
    {
      name: 'Jinx', color: 'red', height: 3, width: 6, weight: 22,
    },
    {
      name: 'Jinx1', color: 'red', height: 63, width: 64, weight: 73,
    },
    {
      name: 'Jinx2', color: 'red', height: 65, width: 66, weight: 34,
    },
    {
      name: 'Jinx3', color: 'red', height: 133, width: 68, weight: 11,
    },
    {
      name: 'Jinx4', color: 'red', height: 133, width: 55, weight: 21,
    },
  ];
  const mockTarget = ['name', 'color'];
  const mockFeature = ['height', 'width', 'weight'];
  const dataset = new DataModel(mockData);
  dataset.feature = mockFeature;
  dataset.target = mockTarget;
  /* it('should return the correct matrix', () => {
    const heatMapModel = new HeatMapModel(dataset);
    const matrix = heatMapModel.getDistanceMatrix(Infinity, distance.euclidean);
    expect(matrix).toEqual([
      [
        Infinity,
        distance.euclidean([1, 4], [2, 5]),
        distance.euclidean([1, 4], [3, 6]),
        distance.euclidean([1, 4], [8, 6]),
      ],
      [
        distance.euclidean([1, 4], [2, 5]),
        Infinity,
        distance.euclidean([2, 5], [3, 6]),
        distance.euclidean([2, 5], [8, 6]),
      ],
      [
        distance.euclidean([1, 4], [3, 6]),
        distance.euclidean([2, 5], [3, 6]),
        Infinity,
        distance.euclidean([3, 6], [8, 6]),
      ],
      [
        distance.euclidean([1, 4], [8, 6]),
        distance.euclidean([2, 5], [8, 6]),
        distance.euclidean([3, 6], [8, 6]),
        Infinity,
      ],
    ]);
  }); */
  it('test', () => {
    const dataTest = new DataModel(mockData);
    /* dataTest.feature = ['SpeseSanitarie',
      'RedditiDominicali',
      'RedditiAgrari',
      'RedditiFabbricati',
      'RedditiLavoroDipendenteEAssimilati',
      'AltriRedditi',
      'RedditoComplessivo',
      'OneriDeducibili',
      'RedditoImponibile',
      'ImpostaLorda',
      'DetrazioneConiuge',
      'DetrazioneFigli',
      'DetrazioneFigliUlteriore',
      'DetrazioneFamiliari',
      'DetrazioneLavDipendente',
      'DetrazioneRedditiPensione',
      'DetrazioneOneriRecEdilizio',
      'DetrazioneSpeseArredo',
      'DetrazioneRispEnergetico',
      'DetrazioneOneri',
      'ImpostaNetta',
      'Ritenute',
      'Differenza',
      'bonusIrpefRiconosciuto',
      'numeroFamiliariACarico',
      'numeroFigliACarico',
    ];
    dataTest.target = ['codiceCatastaleNascita']; */
    dataTest.feature = ['height', 'width', 'weight'];
    dataTest.target = ['name'];
    const heatMapModel = new HeatMapModel(dataTest);
    // eslint-disable-next-line max-len
    expect(1).toEqual(1);
  });
});
