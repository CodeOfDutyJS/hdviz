import {
  describe, expect, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import { makeAutoObservable } from 'mobx';
import { distance } from 'ml-distance';
import { RootStore, VisualizationStore } from '../../store/index';
import VisualizationCollector from '../../model/VisualizationsCollector';

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
});

describe('Options', () => {
  test('setDistance', () => {
    visualizationStore.setDistance('euclidean');
    expect(visualizationStore._visualization._options.distanceFn).toBe(distance.euclidean);
  });
});
