import { VisualizationModel } from '../index';
import scatterPlotMatrix from '../d3/ScatterPlotMatrix';
import VisualizationCollector from '../VisualizationsCollector';

class ScatterPlotMatrixModel extends VisualizationModel {
  getPreparedDataset({ normalization }) {
    this.dataModel.setNorm(normalization ? normalization.func : null);
    return {
      data: this.dataModel.getSelectedDataset(),
      features: this.dataModel.features,
      targets: this.dataModel.targets,
      selectedTarget: this.dataModel.getTargetColumns(),
    };
  }
}

export default ScatterPlotMatrixModel;

VisualizationCollector.addVisualization({
  id: 'scatter',
  label: 'Scatter Plot Matrix',
  model: new ScatterPlotMatrixModel(),
  visualization: scatterPlotMatrix,
  options: {
    maxFeatures: 5,
  },
});
