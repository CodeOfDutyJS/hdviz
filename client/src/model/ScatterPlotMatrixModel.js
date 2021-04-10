class ScatterPlotMatrixModel {
  constructor(dataModel) {
    this._dataModel = dataModel;
    if (dataModel.feature.length > 5) {
      throw new Error('Lo Scatter Plot Matrix non può avere più di 5 features, ridurre il numero di features.');
    }
  }

  get dataModel() {
    return this._dataModel;
  }

  set dataModel(value) {
    this._dataModel = value;
  }

  getPreparedDataSet() {
    return this.dataModel.getSelectedDataset();
  }
}

export default ScatterPlotMatrixModel;