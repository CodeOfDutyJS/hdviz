import { makeAutoObservable } from 'mobx';

class DataModel {
  _dataset = [];
  _columns = [];
  _targets = [];
  _features = [];

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
    return featureCols
      .map((value, index) => ({
        ...value,
        ...targetCols[index],
      }));
  }

  getStandardScore() {
    const means = {};
    const deviations = {};
    this.features.forEach((feat) => {
      means[feat] = this.getMean(feat);
      deviations[feat] = this.getSampleDeviation(feat);
    });
    const d = this.getSelectedDataset();
    d.forEach((value) => {
      this.features.forEach((feat) => {
        // eslint-disable-next-line no-param-reassign
        value[feat] = (value[feat] - means[feat]) / deviations[feat];
      });
    });
    return d;
  }

  getDataNormalizedByLength(normFn) {
    const d = this.getSelectedDataset();
    d.map((value) => {
      const length = normFn(value);
      const obj = {};
      this.targets.forEach((t) => {
        obj[t] = value[t];
      });
      this.features.forEach((feat) => {
        obj[feat] = value[feat] / length;
      });
      return obj;
    });
  }

  euclideanNorm(obj) {
    let length;
    this.features.forEach((feat) => {
      length += obj[feat] ** 2;
    });
    return Math.sqrt(length);
  }

  getMean(feat) {
    let total = 0.0;
    this.dataset.forEach((value) => {
      total += value[feat];
    });
    return total / this.dataset.length;
  }

  getPopulationVariance(feat) {
    const mean = this.getMean(feat);
    let variance = 0.0;
    this.dataset.forEach((value) => {
      variance += ((value[feat] - mean) ** 2);
    });
    return variance / this.dataset.length;
  }

  getSampleVariance(feat) {
    const mean = this.getMean(feat);
    let variance = 0.0;
    this.dataset.forEach((value) => {
      variance += ((value[feat] - mean) ** 2);
    });
    return variance / (this.dataset.length - 1);
  }

  getSampleDeviation(feat) {
    return Math.sqrt(this.getSampleVariance(feat));
  }

  getPopulationDeviation(feat) {
    return Math.sqrt(this.getPopulationVariance(feat));
  }

  getQuartiles(feat) {
    const data = this.getFeatureColumns();
    data.sort((a, b) => a[feat] - b[feat]);
    const l = data.length;
    let secondQuartile;
    let firstHalf = [];
    let secondHalf = [];
    if ((l % 2) !== 0) {
      firstHalf = data.slice(0, Math.floor(l / 2));
      secondHalf = data.slice(Math.floor(l / 2) + 1, l);
      secondQuartile = data[Math.floor(l / 2)][feat];
    } else {
      firstHalf = data.slice(0, Math.floor(l / 2));
      secondHalf = data.slice(Math.floor(l / 2), l);
      secondQuartile = (data[(l / 2) - 1][feat] + data[(l / 2)][feat]) / 2;
    }
    let firstQuartile;
    if ((firstHalf.length % 2) !== 0) {
      firstQuartile = firstHalf[Math.floor(firstHalf.length / 2)][feat];
    } else {
      // eslint-disable-next-line max-len
      firstQuartile = (firstHalf[(firstHalf.length / 2) - 1][feat] + firstHalf[(firstHalf.length / 2)][feat]) / 2;
    }
    let thirdQuartile;
    if ((secondHalf.length % 2) !== 0) {
      thirdQuartile = secondHalf[Math.floor(secondHalf.length / 2)][feat];
    } else {
      // eslint-disable-next-line max-len
      thirdQuartile = (secondHalf[(secondHalf.length / 2) - 1][feat] + secondHalf[(secondHalf.length / 2)][feat]) / 2;
    }
    const r = {
      Q1: firstQuartile,
      Q2: secondQuartile,
      Q3: thirdQuartile,
      Iqr: thirdQuartile - firstQuartile,
    };

    return r;
  }
}

export default DataModel;
