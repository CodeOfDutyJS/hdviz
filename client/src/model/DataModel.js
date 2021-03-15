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
      (value) => (
        Object
          .keys(value) // stream delle chiavi contenute in value (riga del dataset)
          .filter((key) => this.target.indexOf(key) !== -1)
          .reduce((obj, key) => ({ // riduce l'array di chiavi in un object literal
            ...obj,
            [key]: value[key],
          }), {})
      ),
    );
  }

  getFeatureColumns() {
    return this.dataset.map(
      (value) => Object
        .keys(value) // stream delle chiavi contenute in value (riga del dataset)
        .filter((key) => this.feature.indexOf(key) !== -1)
        .reduce((obj, key) => ({ // riduce l'array di chiavi in un object literal
          ...obj,
          [key]: value[key],
        }), {})
      ,
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
}

export default DataModel;
