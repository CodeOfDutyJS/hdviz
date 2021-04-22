import { distance } from 'ml-distance';
import { makeAutoObservable } from 'mobx';
import VisualizationManager from '../model/VisualizationManager';
import VisualizationCollector from '../model/VisualizationsCollector';

class VisualizationStore {
  rootStore;

  _visualization = null;
  targetColor1 = '#ecf1f5';
  targetColor2 = '#efd2d0';

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
    this.visualizationSelected = VisualizationCollector.visualizations[value];

    this.rootStore.modelStore.checkFeatures();
  }

  setDistance(value) {
    this._visualization.addOption({ distanceFn: distance[value] });
  }
}

export default VisualizationStore;
