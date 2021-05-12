import {
  describe,
  test,
  expect,
  jest,
  beforeEach,
} from '@jest/globals';
import { makeAutoObservable } from 'mobx';
import { parse } from 'papaparse';
import { DataModel } from '../../../model/index';
import { RootStore, ModelStore } from '../../../store/index';

jest.mock('papaparse');
jest.mock('../../../model/index');
jest.mock('../../../store/index');
jest.mock('mobx');

beforeEach(() => {
  makeAutoObservable.mockClear();
  parse.mockClear();
  DataModel.mockClear();
  RootStore.mockClear();
});

describe('#ModelStore', () => {
  describe('All calls working as intended', () => {
    test('constructor', () => {
      const modelStore = new ModelStore(new RootStore());
      expect('RootStore').toHaveBeenCalled();
      expect('makeAutoObservable').toHaveBeenCalled();
      expect('DataModel').toHaveBeenCalled();
    });
  });
});
