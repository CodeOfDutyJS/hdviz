import {
  describe, expect, test, jest, beforeEach, afterEach,
} from '@jest/globals';
import { makeAutoObservable } from 'mobx';
import { RootStore, UiStore } from '../store/index';

jest.mock('mobx');

let rootStore;
let uiStore;

beforeEach(() => {
  makeAutoObservable.mockClear();

  rootStore = new RootStore();
  uiStore = rootStore.uiStore;
});

describe('UiStore', () => {
  test('maxTargets', () => {
    uiStore.maxTargets = true;
    expect(uiStore.maxTargets).toBe(true);
  });

  test('maxFeatures', () => {
    uiStore.maxFeatures = true;
    expect(uiStore.maxFeatures).toBe(true);
  });

  test('loadingDataCompleted', () => {
    uiStore.loadingDataCompleted = true;
    expect(uiStore.loadingDataCompleted).toBe(true);
  });

  test('dataError', () => {
    uiStore.dataError = [{ error: 'Test', message: 'test' }];
    expect(uiStore.dataError).toStrictEqual([{ error: 'Test', message: 'test' }]);
  });
});
