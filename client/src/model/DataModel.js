class DataModel {
  constructor(dataset) {
    this._dataset = dataset;
  }

  get dataset() {
    return this._dataset;
  }

  set dataset(value) {
    this._dataset = value;
  }

  get feature() {
    return this._feature;
  }

  set feature(value) {
    this._feature = value;
  }

  get target() {
    return this._target;
  }

  set target(value) {
    this._target = value;
  }

  getTargetColumns() {
    return this.dataset.map(
      (value) => this.target.reduce(
        (acc, key) => ({
          ...acc,
          [key]: value[key],
        }), {},
      ),
    );
  }

  getFeatureColumns() {
    return this.dataset.map(
      (value) => this.feature.reduce(
        (acc, key) => ({
          ...acc,
          [key]: value[key],
        }), {},
      ),
    );
  }

  getSelectedDataset() {
    return this.dataset.map(
      (value) => Object
        .keys(value) // stream delle chiavi contenute in value (riga del dataset)
        .filter((key) => this.feature.indexOf(key) !== -1
          || this.target.indexOf(key) !== -1)
        .reduce((obj, key) => ({ // riduce l'array di chiavi in un object literal
          ...obj,
          [key]: value[key],
        }), {})
      ,
    );
  }

  getStandardScore() {
    const means = {};
    const deviations = {};
    this.feature.forEach((feat) => {
      means[feat] = this.getMean(feat);
      deviations[feat] = this.getSampleDeviation(feat);
    });
    const d = this.getSelectedDataset();
    d.forEach((value) => {
      this.feature.forEach((feat) => {
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
      this.target.forEach((t) => {
        obj[t] = value[t];
      });
      this.feature.forEach((feat) => {
        obj[feat] = value[feat] / length;
      });
      return obj;
    });
  }

  euclideanNorm(obj) {
    let length;
    this.feature.forEach((feat) => {
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
