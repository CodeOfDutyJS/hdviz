import VisualizationModel from '../VisualizationModel';

class ScatterPlotMatrixModel extends VisualizationModel {
  getPreparedDataset() {
    return {
      data: this.dataModel.getSelectedDataset(),
      features: this.dataModel.features,
      targets: this.dataModel.targets,
    };
  }
}

export default ScatterPlotMatrixModel;
