import { makeAutoObservable } from 'mobx';

class DataModel {
  _dataset = [];
  _columns = [];
  _targets = [];
  _features = [];
  toNorm;
  constructor() {
    makeAutoObservable(this, { _dataset: false });
  }

  get dataset() {
    return this._dataset;
  }

  set dataset(value) {
    this._dataset = value;
    this.columns = Object.keys(this.dataset[0]);
  }

  get columns() {
    return this._columns;
  }

  set columns(value) {
    // eslint-disable-next-line no-restricted-globals
    this._columns = value.map((col) => ({ value: col, isNumber: !isNaN(this.dataset[0][col]) }));
  }

  get features() {
    return this._features;
  }

  set features(value) {
    // TODO: controllo se variabile feature contiene valori numerici o stringhe
    this._features = value.filter((f) => this.columns.find((c) => c.value === f).isNumber);
  }

  get targets() {
    return this._targets;
  }

  set targets(value) {
    this._targets = value;
  }

  cleanDataset() {
    return this;
  }

  setNorm(norm) {
    this.toNorm = norm;
    return this;
  }

  getTargetColumns() {
    return this.dataset.map(
      (value) => this.targets.reduce(
        (acc, key) => ({
          ...acc,
          [key]: value[key],
        }), {},
      ),
    );
  }

  getFeatureColumns() {
    return this.dataset.map(
      (value) => this.features.reduce(
        (acc, key) => ({
          ...acc,
          [key]: value[key],
        }), {},
      ),
    );
  }

  getSelectedDataset() {
    const targetCols = this.getTargetColumns();
    const featureCols = this.getFeatureColumns();
    const r = featureCols
      .map((value, index) => ({
        ...value,
        ...targetCols[index],
      }));
    if (this.toNorm) return this.toNorm(r, this.features);
    return r;
  }
}

export default DataModel;
