import { distance } from 'ml-distance';
import { makeAutoObservable } from 'mobx';
import * as saver from 'save-svg-as-png';
import VisualizationManager from '../model/VisualizationManager';
import VisualizationCollector from '../model/VisualizationsCollector';
import NormalizationCollector from '../model/normalizations/NormalizationsCollector';

class VisualizationStore {
  rootStore;

  _visualization = null;
  targetColor1 = '#ecf1f5';
  targetColor2 = '#efd2d0';
  primoRangeHeatmap = 0;
  secondoRangeHeatmap = 0;

  isNormalized = false;
  canSave = false;

  constructor(rootStore) {
    this.rootStore = rootStore;
    this._visualization = new VisualizationManager();

    makeAutoObservable(this, { rootStore: false }, { autoBind: true });
  }

  start() {
    // TEST FORCEFIELD
    this._visualization.addOption({ maxNodes: 150 });
    this._visualization.addOption({ maxLinks: 150 });
    try {
      if (this.rootStore.modelStore.features.length === 0) {
        throw new Error('Select at least one feature');
      }
      if (this.visualizationSelected?.id === 'heatmap' && this.rootStore.modelStore.targets.length === 0) {
        throw new Error('Select at least one target');
      }
      this._visualization.start(this.rootStore.modelStore.data);
    } catch (e) {
      switch (e.message) {
        case 'Cannot read property \'visualization\' of null':
          this.rootStore.uiStore.addError('error', 'Select a visualization');
          break;
        case 'distanceFn is not a function' || 'this._distanceFn is not a function':
          this.rootStore.uiStore.addError('error', 'Select a distance');
          break;
        case 'Select at least one feature':
          this.rootStore.uiStore.addError('error', 'Select at least one feature');
          break;
        case 'Select at least one target':
          this.rootStore.uiStore.addError('error', 'Select at least one target');
          break;
        default:
          break;
      }
    }
    this.canSave = true;
  }

  save() {
    if (document.getElementById('area') && this.canSave) {
      saver.saveSvgAsPng(document.getElementById('area'), 'graph.png', { backgroundColor: '#ffffff' });
    } else {
      // error implementation
    }
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

  setIsNormalized(value) {
    this.isNormalized = value.target.checked;
  }

  setNormalization(value) {
    this._visualization.addOption({ normalization: NormalizationCollector._normalizations[value] });
  }

  setClustering(value) {
    this._visualization.addOption({ clustering: value });
  }

  setInitialHeatmapColor(value) {
    this.targetColor1 = value.hex;
    this._visualization.addOption({ initialColor: this.targetColor1 });
  }

  setFinalHeatmapColor(value) {
    this.targetColor2 = value.hex;
    this._visualization.addOption({ finalColor: this.targetColor2 });
  }

  setPrimoRangeHeatmap(value) {
    this.primoRangeHeatmap = value;
    this._visualization.addOption({ initialRangeValue: this.primoRangeHeatmap });
  }

  setSecondoRangeHeatmap(value) {
    this.secondoRangeHeatmap = value;
    this._visualization.addOption({ finalRangeValue: this.secondoRangeHeatmap });
  }

  setSpread(value) {
    this._visualization.addOption({ spread: value });
  }

  setNeighbors(value) {
    this._visualization.addOption({ nNeighbors: value });
  }

  setMinDistance(value) {
    this._visualization.addOption({ minDistance: value });
  }
}

export default VisualizationStore;
