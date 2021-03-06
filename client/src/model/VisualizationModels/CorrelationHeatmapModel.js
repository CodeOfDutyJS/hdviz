import { DistanceType, ClusteringType } from '../../utils/options';
import HeatMapModel from './HeatMapModel';
import VisualizationCollector from '../VisualizationsCollector';
import { correlationHeatmap } from '../d3';

class CorrelationHeatmapModel extends HeatMapModel {
  getPreparedDataset({ initialColor, finalColor, clustering = ClusteringType.SINGLE }) {
    this._distanceFn = DistanceType.PEARSONS;
    return {
      cluster: this.getLinkage(clustering),
      color: [initialColor, '#FFF', finalColor],
    };
  }
}

export default CorrelationHeatmapModel;

VisualizationCollector.addVisualization({
  id: 'correlation',
  label: 'Correlation Heatmap',
  model: new CorrelationHeatmapModel(),
  visualization: correlationHeatmap,
  options: { distance: false, color: true, clustering: true },
});
