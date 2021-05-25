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

  getFeatureColumnsNormalized() {
    const r = this.getFeatureColumns();
    if (this.toNorm) return this.toNorm(r, this.features);
    return r;
  }

  // eslint-disable-next-line class-methods-use-this
  stratifiedSampling(data, target, numberOfItems) {
    const sortContainer = {};
    data.forEach((row) => {
      if (!(target in sortContainer)) {
        sortContainer[target] = [];
        sortContainer[target].push(row);
      } else {
        sortContainer[target].push(row);
      }
    });
    const fraction = numberOfItems / data.length;
    const returnValue = [];
    Object.keys(sortContainer).forEach((key) => {
      const frac = Math.floor(sortContainer[key].length * fraction);
      for (let i = 0; i < frac; i++) {
        const index = Math.floor(Math.random() * (sortContainer[key].length));
        returnValue.push(sortContainer[key][index]);
        sortContainer[key].splice(index, 1);
      }
    });
    return returnValue;
  }

  // eslint-disable-next-line class-methods-use-this
  kthSampling(data, numberOfItems) {
    data.sort((a, b) => {
      const IdA = a[this.targets[0]].toUpperCase(); // ignore upper and lowercase
      const IdB = b[this.targets[0]].toUpperCase(); // ignore upper and lowercase
      if (IdA < IdB) {
        return -1;
      }
      if (IdA > IdB) {
        return 1;
      }
      return 0;
    });
    const returnValue = [];
    const k = Math.floor(Math.random() * 6) + 1;
    for (let i = 0; i < numberOfItems; i++) {
      const index = (k * i + k) % data.length;
      returnValue.push(data[index]);
      data.splice(index, 1);
    }
    return returnValue;
  }

  getSelectedDataset() {
    const targetCols = this.getTargetColumns();
    const featureCols = this.getFeatureColumns();
    let r = featureCols
      .map((value, index) => ({
        ...value,
        ...targetCols[index],
      }));
    if (this.toNorm) r = this.toNorm(r, this.features);
    return r;
  }
}

export default DataModel;
