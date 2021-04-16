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
}

export default RootStore;

export const StoreContext = createContext(RootStore);
export const StoreProvider = StoreContext.Provider;
export const useStore2 = () => useContext(StoreContext);