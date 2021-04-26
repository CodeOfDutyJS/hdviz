import { makeAutoObservable, observable } from 'mobx';
import { clearVisualization } from './d3/index';
import NormalizationsCollector from './normalizations/NormalizationsCollector';

class VisualizationManager {
  _visualizationSelected = null;
  _options;

  // eslint-disable-next-line class-methods-use-this
  clear() {
    clearVisualization();
  }

  constructor() {
    makeAutoObservable(this, { _visualizationSelected: observable.ref, _options: observable.ref }, { autoBind: true });
  }

  addOption(option) {
    this._options = { ...this._options, ...option };
  }

  start(data) {
    this.clear();
    this._visualizationSelected.model
      .addData(data)
      ._dataModel
      .setNorm(NormalizationsCollector._normalizations.SS.func);
    this._visualizationSelected.visualization(this._visualizationSelected.model.addData(data).getPreparedDataset(this._options));
  }

  // GETTER / SETTER
  get visualizationSelected() {
    return this._visualizationSelected;
  }

  set visualizationSelected(value) {
    this._visualizationSelected = value;
  }
}

export default VisualizationManager;
