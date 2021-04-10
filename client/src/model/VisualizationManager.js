import { makeAutoObservable, observable } from 'mobx';

class VisualizationManager {
  _visualizationSelected = null;
  _options;

  constructor() {
    makeAutoObservable(this, { _visualizationSelected: observable.ref, _options: observable.ref }, { autoBind: true });
  }

  addOption(option) {
    this._options = { ...this._options, ...option };
  }

  start(data) {
    this._visualizationSelected.before();
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
