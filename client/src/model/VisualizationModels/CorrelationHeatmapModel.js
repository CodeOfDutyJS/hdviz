import { DistanceType, ClusteringType } from '../../utils/options';
// eslint-disable-next-line import/no-cycle
import { HeatMapModel } from './index';
import VisualizationCollector from '../VisualizationsCollector';
import { correlationHeatmap } from '../d3';

class CorrelationHeatmapModel extends HeatMapModel {
  getPreparedDataset({ clusteringType = ClusteringType.SINGLE }) {
    this._distanceFn = DistanceType.PEARSONS;
    return {
      cluster: this.getLinkage(clusteringType),
    };
  }
}

export default CorrelationHeatmapModel;

VisualizationCollector.addVisualization({
  id: 'force',
  label: 'Force Field',
  model: new CorrelationHeatmapModel(),
  visualization: correlationHeatmap,
  options: { distance: true },
});
