import { distance } from 'ml-distance';
import { makeAutoObservable, observable } from 'mobx';
import VisualizationManager from '../model/VisualizationManager';

import { VisualizationType } from '../utils/constant';

class VisualizationStore {
  rootStore;

  _visualization = null;

  constructor(rootStore) {
    this.rootStore = rootStore;
    this._visualization = new VisualizationManager();

    makeAutoObservable(this, { rootStore: false }, { autoBind: true });
  }

  start() {
    // TEST FORCEFIELD
    this._visualization.addOption({ maxNodes: 150 });
    this._visualization.addOption({ maxLinks: 150 });

    this._visualization.start(this.rootStore.modelStore.data);
  }

  // GETTER / SETTER
  get visualizationSelected() {
    return this._visualization.visualizationSelected;
  }

  set visualizationSelected(value) {
    this._visualization.visualizationSelected = value;
  }

  setVisualizationSelected(value) {
    this.visualizationSelected = Object.values(VisualizationType).find((v) => v.id === value);

    this.rootStore.modelStore.checkFeatures();
  }

  setDistance(value) {
    this._visualization.addOption({ distanceFn: distance[value] });
  }
}

export default VisualizationStore;
