import { createContext, useContext } from 'react';
import ModelStore from './ModelStore';
import DatabaseStore from './DatabaseStore';
import ApiService from '../services/ApiService';
import VisualizationStore from './VisualizationStore';
import UiStore from './UiStore';

class RootStore {
  constructor() {
    this.modelStore = new ModelStore(this);
    this.databaseStore = new DatabaseStore(this, { apiService: new ApiService() });
    this.visualizationStore = new VisualizationStore(this);
    this.uiStore = new UiStore(this);
  }

  getUiStoreDataError() {
    return this.uiStore.dataError;
  }

  setUiStoreMaxFeatures(value) {
    this.uiStore.maxFeatures = value;
  }

  setUiStoreMaxTargets(value) {
    this.uiStore.maxTargets = value;
  }

  setUiStoreLoadingDataCompleted(value) {
    this.uiStore.loadingDataCompleted = value;
  }

  getVisualizationSelectedMaxFeatures() {
    return this.visualizationStore.visualizationSelected.options?.maxFeatures;
  }
}

export default RootStore;

export const StoreContext = createContext(RootStore);
export const StoreProvider = StoreContext.Provider;
export const useStore = () => useContext(StoreContext);
