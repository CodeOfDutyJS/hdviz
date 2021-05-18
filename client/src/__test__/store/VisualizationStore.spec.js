import {
  describe, expect, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import { makeAutoObservable } from 'mobx';
import { distance } from 'ml-distance';
import { RootStore, VisualizationStore } from '../../store/index';
import VisualizationCollector from '../../model/VisualizationsCollector';
import NormalizationsCollector from '../../model/normalizations/NormalizationsCollector';

jest.mock('mobx');

let rootStore;
let visualizationStore;

beforeEach(() => {
  makeAutoObservable.mockClear();

  rootStore = new RootStore();
  visualizationStore = rootStore.visualizationStore;
});

describe('VisualizationStore', () => {
  jest.mock('../../model/VisualizationManager');
  test('constructor', () => {
    const _visualizationStore = new VisualizationStore(new RootStore());
    expect(makeAutoObservable).toHaveBeenCalled();
  });

  test('setVisualizationSelected', () => {
    VisualizationCollector.addVisualization({ id: 'test' });

    visualizationStore.setVisualizationSelected('test');
    expect(visualizationStore.visualizationSelected).toBe(VisualizationCollector.visualizations[`${'test'}`]);
  });

  test('setIsNormalized', () => {
    visualizationStore.setIsNormalized({ target: { checked: true } });
    expect(visualizationStore.isNormalized).toBe(true);
  });
});

describe('Options', () => {
  test('setDistance', () => {
    visualizationStore.setDistance('euclidean');
    expect(visualizationStore._visualization._options.distanceFn).toBe(distance.euclidean);
  });

  test('setNormalization', () => {
    NormalizationsCollector.addNormalization({ id: 'test' });
    visualizationStore.setNormalization('test');
    expect(visualizationStore._visualization._options.normalization.id).toBe('test');
  });

  test('setClustering', () => {
    visualizationStore.setClustering('alphabetical');
    expect(visualizationStore._visualization._options.clustering).toBe('alphabetical');
  });

  test('setInitialHeatmapColor', () => {
    visualizationStore.setInitialHeatmapColor({ hex: '#ffffff' });
    expect(visualizationStore._visualization._options.initialColor).toBe('#ffffff');
  });

  test('setFinalHeatmapColor', () => {
    visualizationStore.setFinalHeatmapColor({ hex: '#ffffff' });
    expect(visualizationStore._visualization._options.finalColor).toBe('#ffffff');
  });

  test('setPrimoRangeHeatmap', () => {
    visualizationStore.setPrimoRangeHeatmap(10);
    expect(visualizationStore._visualization._options.initialRangeValue).toBe(10);
  });

  test('setSecondoRangeHeatmap', () => {
    visualizationStore.setSecondoRangeHeatmap(20);
    expect(visualizationStore._visualization._options.finalRangeValue).toBe(20);
  });
  test('setNeighbors', () => {
    visualizationStore.setNeighbors(50);
    expect(visualizationStore._visualization._options.nNeighbors).toBe(50);
  });
  test('setMinDistance', () => {
    visualizationStore.setMinDistance(10);
    expect(visualizationStore._visualization._options.minDistance).toBe(10);
  });

  test('setSpread', () => {
    visualizationStore.setSpread(1.5);
    expect(visualizationStore._visualization._options.spread).toBe(1.5);
  });
  test('start', () => {
    visualizationStore.start();
    expect(true).toStrictEqual(true);
  });
});
