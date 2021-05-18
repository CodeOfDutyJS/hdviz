import {
  beforeEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals';
import { makeAutoObservable } from 'mobx';
import { DataModel } from '../../model/index';
import {
  RootStore,
  ModelStore,
  UiStore,
  VisualizationStore,
} from '../../store/index';

jest.mock('../../model/DataModel');
jest.mock('mobx');

beforeEach(() => {
  makeAutoObservable.mockClear();
  DataModel.mockClear();
});

describe('#ModelStore', () => {
  describe('constructor', () => {
    it('should make right calls', () => {
      const rootStore = new RootStore();
      const { modelStore } = rootStore.modelStore;
      expect(makeAutoObservable).toHaveBeenCalled();
      // expect(RootStore).toHaveBeenCalled();
      expect(DataModel).toHaveBeenCalledTimes(1);
    });
  });

  describe('#UploadCSV', () => {
    let modelStore = {};
    beforeEach(() => {
      const rootStore = new RootStore();
      modelStore = rootStore.modelStore;
    });
    it('should upload data correctly', async () => {
      const loadingDataSpy = jest.spyOn(UiStore.prototype, 'loadingDataCompleted', 'set');
      const setDatasetSpy = jest.spyOn(ModelStore.prototype, 'setDataset');
      const dataErrorSpy = jest.spyOn(UiStore.prototype, 'addError')
        .mockImplementationOnce(() => []);

      await modelStore.uploadCSV('Hello,Beautiful,World\n1,2,3');

      expect(modelStore.loadingCompleted).toBeTruthy();
      expect(dataErrorSpy).not.toHaveBeenCalled();
      expect(setDatasetSpy).toHaveBeenCalled();
      expect(loadingDataSpy).toHaveBeenCalled();
    });
    it('should upload data but with error', async () => {
      const mockDataError = {};
      jest.spyOn(UiStore.prototype, 'dataError', 'get')
        .mockImplementationOnce(() => mockDataError);
      await modelStore.uploadCSV('This,is/not a.csv\nfile');
      expect(modelStore.loadingCompleted).toBeTruthy();
      expect(mockDataError).toBeTruthy();
    });
    it('should not upload data with exception', async () => {
      const mockDataError = {};
      jest.spyOn(UiStore.prototype, 'dataError', 'get')
        .mockImplementationOnce(() => mockDataError);
      jest.spyOn(ModelStore, 'parseFile')
        .mockImplementationOnce(() => { throw new Error('HELLO :('); });
      await modelStore.uploadCSV('hello world');

      expect(modelStore.loadingCompleted).not.toBeTruthy();
      expect(mockDataError).toBeTruthy();
    });
  });

  describe('#checkFeatures', () => {
    const maxFeaturesSpy = jest.spyOn(UiStore.prototype, 'maxFeatures', 'set');
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
      const maxFeaturesSelectedSpy = jest.spyOn(VisualizationStore.prototype, 'visualizationSelected', 'get').mockImplementation(() => ({
        options: {
          maxFeatures: 5,
        },
      }));
      modelStore.features = [];
      modelStore.features.length = 7;
      modelStore.checkFeatures();
      expect(maxFeaturesSpy.mock.calls[0][0]).toBeTruthy();
    });
  });

  describe('#setTargets', () => {
    const maxTargetsSpy = jest.spyOn(UiStore.prototype, 'maxTargets', 'set').mockImplementation(() => 2);
    let modelStore = {};

    beforeEach(() => {
      maxTargetsSpy.mockClear();
      const rootStore = new RootStore();
      modelStore = rootStore.modelStore;
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
