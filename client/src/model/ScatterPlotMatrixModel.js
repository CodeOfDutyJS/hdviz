import DataModel from './DataModel';

class ScatterPlotMatrixModel {
  constructor(dataModel) {
    this._dataModel = dataModel;
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
