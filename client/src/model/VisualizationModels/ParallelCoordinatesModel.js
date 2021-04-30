import { VisualizationModel } from '../index';
import { parallelCoordinates } from '../d3/index';
import VisualizationCollector from '../VisualizationsCollector';

class ParallelCoordinatesModel extends VisualizationModel {
  getPreparedDataset() {
    return {
      selectedData: this.dataModel.getSelectedDataset(),
      features: this.dataModel.features,
      targets: this.dataModel.targets,
      selectedTarget: this.dataModel.getTargetColumns(),
    };
  }
}

export default ParallelCoordinatesModel;

VisualizationCollector.addVisualization({
  id: 'parallel',
  label: 'Parallel Coordinates',
  model: new ParallelCoordinatesModel(),
  visualization: parallelCoordinates,
  options: {},
});
