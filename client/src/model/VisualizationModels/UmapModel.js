import { UMAP } from 'umap-js';
import { extent } from 'd3';
import VisualizationModel from '../VisualizationModel';

class UmapModel extends VisualizationModel {
  umap(label) {
    const umap = new UMAP({
      nComponents: 2,
      minDist: 0.1,
      spread: 1,
      nNeighbors: 15,
    });
    console.log(this.dataModel.getSelectedDataset());
    const data = this.dataModel
      .getStandardScore()
      .map((row) => Object.values(row));

    // umap.setSupervisedProjection(label);
    console.log(data);
    umap.fit(data);
    const trasformed = umap.getEmbedding();

    return { points: trasformed };
  }

  getPreparedDataset() {
    const label = this.dataModel.getTargetColumns();
    const projection = this.umap([...new Set(label.map((d) => d[this.dataModel.targets[0]]))]);

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
