class VisualizationModel {
  _dataModel = [];

  get dataModel() {
    return this._dataModel;
  }

  set dataModel(value) {
    this._dataModel = value;
  }

  addData(data) {
    this._dataModel = data;
    return this;
  }

  // eslint-disable-next-line class-methods-use-this
  getPreparedDataset() {
    throw new Error('You have to implement this method');
  }
}

export default VisualizationModel;
