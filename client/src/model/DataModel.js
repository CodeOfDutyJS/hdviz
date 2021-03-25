class DataModel {
  constructor() {
    this._dataset = [];
    this._target = [];
    this._feature = [];
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
    // TODO: controllo se variabile feature contiene valori numerici o stringhe
    this._feature = value;
  }

  get target() {
    return this._target;
  }

  set target(value) {
    this._target = value;
  }

  cleanDataset() {
    return this;
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
    const targetCols = this.getTargetColumns();
    const featureCols = this.getFeatureColumns();
    return featureCols
      .map((value, index) => ({
        ...value,
        ...targetCols[index],
      }));
  }
}

export default DataModel;
