import { DistanceType, ClusteringType } from '../../utils/options';
import HeatMapModel from './HeatMapModel';

class CorrelationHeatmapModel extends HeatMapModel {
  getPreparedDataset({ clusteringType = ClusteringType.SINGLE }) {
    this._distanceFn = DistanceType.PEARSONS;
    return {
      cluster: this.getLinkage(clusteringType),
    };
  }
}

export default CorrelationHeatmapModel;
