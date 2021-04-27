import { UMAP } from 'umap-js';
import { extent } from 'd3';
import umap from '../d3/Umap';
import VisualizationModel from '../VisualizationModel';
import VisualizationCollector from '../VisualizationsCollector';
import StandardScore from '../normalizations/StandardScore';

class UmapModel extends VisualizationModel {
  Umap(label) {
    const uMap = new UMAP({
      nComponents: 2,
      minDist: 0.1,
      spread: 1,
      nNeighbors: 15,
    });
    const data = this.dataModel
      .setNorm(StandardScore)
      .getSelectedDataset()
      .map((row) => Object.values(row));

    // umap.setSupervisedProjection(label);
    uMap.fit(data);
    const trasformed = uMap.getEmbedding();

    return { points: trasformed };
  }

  getPreparedDataset() {
    const label = this.dataModel.getTargetColumns();
    const projection = this.Umap([...new Set(label.map((d) => d[this.dataModel.targets[0]]))]);

    const preparedPoints = [];
    projection.points
      .map((d, i) => preparedPoints
        .push({
          x: d[0],
          y: d[1],
          color: this.dataModel.targets.length > 0 ? label[i][this.dataModel.targets[0]] : null,
          shape: this.dataModel.targets.length > 1 ? label[i][this.dataModel.targets[1]] : null,
        }));

    return {
      points: preparedPoints,
      points_rangeX: extent(preparedPoints.map((d) => d.x)),
      points_rangeY: extent(preparedPoints.map((d) => d.y)),
      target1: this.dataModel.targets.length > 0 ? [...new Set(label.map((d) => d[this.dataModel.targets[0]]))] : null,
      target2: this.dataModel.targets.length > 1 ? [...new Set(label.map((d) => d[this.dataModel.targets[1]]))] : null,
    };
  }
}

export default UmapModel;

/* VisualizationCollector.addVisualization({
  id: 'umap',
  label: 'Umap',
  model: new UmapModel(),
  visualization: umap,
  options: { distance: false },
}); */
