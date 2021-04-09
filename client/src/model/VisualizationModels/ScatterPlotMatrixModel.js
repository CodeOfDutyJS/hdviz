import VisualizationModel from '../VisualizationModel';

class ScatterPlotMatrixModel extends VisualizationModel {
  getPreparedDataset() {
    return this.dataModel.getSelectedDataset();
  }
}

export default ScatterPlotMatrixModel;
