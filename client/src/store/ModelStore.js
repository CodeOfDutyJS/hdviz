import { makeAutoObservable } from 'mobx';
import Papa from 'papaparse';
import { DataModel } from '../model/index';

class ModelStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
    this.dataModel = new DataModel();
    this.loadingCompleted = false;
    makeAutoObservable(this, { rootStore: false }, { autoBind: true });
  }

  static parseFile(rawFile) {
    return new Promise((resolve, reject) => {
      Papa.parse(rawFile, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        worker: true,
        complete: (results) => {
          resolve(results);
        },
        error: (error) => {
          reject(error.message);
        },
      });
    });
  }

  async uploadCSV(file) {
    try {
      const results = await this.constructor.parseFile(file);
      this.loadingCompleted = true;
      this.setDataset(results.data);
      if (results.errors.length > 0) {
        results.errors.forEach((error) => {
          this.rootStore.uiStore.addError('warning', `Error ${error.code}: ${error.message}`);
        });
      }
    } catch (error) {
      this.rootStore.uiStore.addError({
        status: 'error',
        message: `Error: ${error.message}`,
      });
    }
  }

  checkFeatures() {
    const maxFeatures = this.rootStore.visualizationStore.visualizationSelected?.options?.maxFeatures;
    if (
      maxFeatures
      && this.features.length > maxFeatures
    ) {
      this.features = this.features.slice(0, maxFeatures);
      this.rootStore.uiStore.maxFeatures = true;
    } else {
      this.rootStore.uiStore.maxFeatures = false;
    }
  }

  // GETTER / SETTER
  get data() {
    return this.dataModel;
  }

  setDataset(value) {
    this.features = [];
    this.targets = [];
    this.dataModel.dataset = value;
    this.rootStore.uiStore.loadingDataCompleted = true;
  }

  get columns() {
    return this.dataModel.columns;
  }

  set columns(value) {
    this.dataModel.columns = value;
  }

  setColumns(value) {
    this.columns = value;
  }

  get features() {
    return this.dataModel.features;
  }

  set features(value) {
    this.dataModel.features = value;
  }

  setFeatures(value) {
    this.features = value;
    this.checkFeatures();
  }

  get targets() {
    return this.dataModel.targets;
  }

  set targets(value) {
    this.dataModel.targets = value;
  }

  setTargets(value) {
    if (value.length > 2) {
      value.pop();
      this.rootStore.uiStore.maxTargets = true;
    } else {
      this.rootStore.uiStore.maxTargets = false;
    }
    this.targets = value;
  }
}

export default ModelStore;
