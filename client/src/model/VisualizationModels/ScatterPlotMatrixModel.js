import VisualizationModel from '../VisualizationModel';
import scatterPlotMatrix from '../d3/ScatterPlotMatrix';
import VisualizationCollector from '../VisualizationsCollector';

class ScatterPlotMatrixModel extends VisualizationModel {
  getPreparedDataset() {
    return this.dataModel.getSelectedDataset();
  }
}

VisualizationCollector.addVisualization({
  id: 'scatter',
  label: 'Scatter Plot Matrix',
  model: new ScatterPlotMatrixModel(),
  visualization: scatterPlotMatrix,
});
