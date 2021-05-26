import { UMAP } from 'umap-js';
import { extent } from 'd3';
import umap from '../d3/Umap';
import VisualizationModel from '../VisualizationModel';
import VisualizationCollector from '../VisualizationsCollector';
import StandardScore from '../normalizations/StandardScore';

class UmapModel extends VisualizationModel {
  // eslint-disable-next-line class-methods-use-this
  Umap(data, nNeighbors, minDistance, spread) {
    const uMap = new UMAP({
      nComponents: 3,
      minDist: minDistance,
      spread,
      nNeighbors,
    });
    uMap.fit(data);
    const trasformed = uMap.getEmbedding();
    return { points: trasformed };
  }

  getPreparedDataset({ nNeighbors = 15, minDistance = 0.1, spread = 1 }) {
    const label = this.dataModel.getTargetColumns();
    const data = this.dataModel
      .setNorm(StandardScore)
      .getFeatureColumnsNormalized()
      .map((row) => Object.values(row));
    const projection = this.Umap(data, nNeighbors, minDistance, spread);
    const preparedPoints = [];
    projection.points
      .map((d, i) => preparedPoints
        .push({
          x: d[0],
          y: d[1],
          z: d[2],
          color: this.dataModel.targets.length > 0 ? label[i][this.dataModel.targets[0]] : null,
          shape: this.dataModel.targets.length > 1 ? label[i][this.dataModel.targets[1]] : null,
          // description: this.dataModel.setNorm(null).getSelectedDataset()[i],
        }));
    return {
      points: preparedPoints,
      target1: this.dataModel.targets.length > 0 ? [...new Set(label.map((d) => d[this.dataModel.targets[0]]))] : null,
      target2: this.dataModel.targets.length > 1 ? [...new Set(label.map((d) => d[this.dataModel.targets[1]]))] : null,
      selectedTarget: this.dataModel.getTargetColumns(),
    };
  }
}

export default UmapModel;
VisualizationCollector.addVisualization({
  id: 'umap',
  label: 'Linear Projection (UMAP)',
  model: new UmapModel(),
  visualization: umap,
  options: { nNeighbors: true, minDistance: true, spread: true },
});
