import { makeAutoObservable } from 'mobx';
import Papa from 'papaparse';
import DataModel from '../model/DataModel';

import VisualizationCollector from '../model/VisualizationsCollector';

const parseFile = (rawFile) => new Promise((resolve, reject) => {
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

class ModelStore {
  rootStore;
  dataModel = null;
  loadingCompleted = false;

  constructor(rootStore) {
    this.rootStore = rootStore;

    makeAutoObservable(this, { rootStore: false }, { autoBind: true });

    this.dataModel = new DataModel();
  }

  async uploadCSV(file) {
    try {
      const results = await parseFile(file);
      console.log(results);
      this.dataset = results.data;
      this.loadingCompleted = true;
      if (results.errors.length > 0) {
        results.errors.forEach((error) => {
          this.rootStore.uiStore.dataError.push({
            status: 'warning',
            message: `Error ${error.code}: ${error.message}`,
          });
        });
      }
    } catch (error) {
      // TODO: visualizzare errore

      console.log(error);
      this.rootStore.uiStore.dataError = {
        status: 'error',
        message: `Error: ${error.message}`,
      };
    }
  }

  checkFeatures() {
    if (this.rootStore.visualizationStore.visualizationSelected === VisualizationCollector.visualizations.matrix && this.features.length > 5) {
      this.features = this.features.slice(0, 5);

      this.rootStore.uiStore.maxFeatures = true;
    } else {
      this.rootStore.uiStore.maxFeatures = false;
    }
  }

  // GETTER / SETTER
  get data() {
    console.log(this.dataModel);
    return this.dataModel;
  }

  set dataset(value) {
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
