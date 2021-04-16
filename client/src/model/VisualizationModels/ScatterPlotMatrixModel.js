import { VisualizationModel } from '../index';

class ScatterPlotMatrixModel extends VisualizationModel {
  getPreparedDataset() {
    return {
      data: this.dataModel.getSelectedDataset(),
      features: this.dataModel.features,
      targets: this.dataModel.targets,
      selectedTarget: this.dataModel.getTargetColumns(),
    };
  }
}

export default ScatterPlotMatrixModel;
