import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { max } from 'd3-array';
import { makeAutoObservable } from 'mobx';
import { DataModel } from '../../model/index';
import {
  RootStore,
  ModelStore,
} from '../../store/index';

jest.mock('../../model/DataModel');
jest.mock('../../store/RootStore');
jest.mock('mobx');

beforeEach(() => {
  makeAutoObservable.mockClear();
  DataModel.mockClear();
  RootStore.mockClear();
});

describe('#ModelStore', () => {
  describe('constructor', () => {
    it('should make right calls', () => {
      const modelStore = new ModelStore(new RootStore());
      expect(makeAutoObservable).toHaveBeenCalled();
      expect(RootStore).toHaveBeenCalled();
      expect(DataModel).toHaveBeenCalledTimes(1);
    });
  });

  describe('#UploadCSV', () => {
    let modelStore = {};
    beforeEach(() => {
      modelStore = new ModelStore(new RootStore());
    });
    it('should upload data correctly', async () => {
      const loadingDataSpy = jest.spyOn(RootStore.prototype, 'setUiStoreLoadingDataCompleted');
      const setDatasetSpy = jest.spyOn(ModelStore.prototype, 'setDataset');
      const dataErrorSpy = jest.spyOn(RootStore.prototype, 'getUiStoreDataError')
        .mockImplementationOnce(() => []);

      await modelStore.uploadCSV('Hello,Beautiful,World\n1,2,3');

      expect(modelStore.loadingCompleted).toBeTruthy();
      expect(dataErrorSpy).toHaveBeenCalled();
      expect(setDatasetSpy).toHaveBeenCalled();
      expect(loadingDataSpy).toHaveBeenCalled();
    });
    it('should upload data but with error', async () => {
      const mockDataError = [];
      jest.spyOn(RootStore.prototype, 'getUiStoreDataError')
        .mockImplementationOnce(() => mockDataError);
      await modelStore.uploadCSV('This,is/not a.csv\nfile');

      expect(modelStore.loadingCompleted).toBeTruthy();
      expect(mockDataError.length).toBeGreaterThan(1);
    });
    it('should not upload data with exception', async () => {
      const mockDataError = [];
      jest.spyOn(RootStore.prototype, 'getUiStoreDataError')
        .mockImplementationOnce(() => mockDataError);
      jest.spyOn(ModelStore, 'parseFile')
        .mockImplementationOnce(() => { throw new Error('HELLO :('); });
      await modelStore.uploadCSV('hello world');

      expect(modelStore.loadingCompleted).not.toBeTruthy();
      expect(mockDataError.length).toBeGreaterThan(0);
    });
  });

  describe('#checkFeatures', () => {
    const maxFeaturesSpy = jest.spyOn(RootStore.prototype, 'setUiStoreMaxFeatures');
    let modelStore = {};

    beforeEach(() => {
      maxFeaturesSpy.mockClear();
      modelStore = new ModelStore(new RootStore());
    });

    it('should check if a max number of features isn\'t set', () => {
      modelStore.checkFeatures();
      expect(maxFeaturesSpy.mock.calls[0][0]).not.toBeTruthy();
    });

    it('should check if a max number of features is set', () => {
      const maxFeaturesSelectedSpy = jest.spyOn(RootStore.prototype, 'getVisualizationSelectedMaxFeatures').mockReturnValueOnce(5);
      modelStore.features = [];
      modelStore.features.length = 7;
      modelStore.checkFeatures();
      expect(maxFeaturesSpy.mock.calls[0][0]).toBeTruthy();
    });
  });
  describe('#setTargets', () => {
    const maxTargetsSpy = jest.spyOn(RootStore.prototype, 'setUiStoreMaxTargets');
    let modelStore = {};

    beforeEach(() => {
      maxTargetsSpy.mockClear();
      modelStore = new ModelStore(new RootStore());
    });

    it('should check if targets are more than 2', () => {
      modelStore.setTargets(['more', 'than', 'two']);
      expect(maxTargetsSpy.mock.calls[0][0]).toBeTruthy();
    });
    it('should check if a max number of targets is set', () => {
      modelStore.setTargets(['exactly', 'two']);
      expect(maxTargetsSpy.mock.calls[0][0]).not.toBeTruthy();
    });
  });
});
