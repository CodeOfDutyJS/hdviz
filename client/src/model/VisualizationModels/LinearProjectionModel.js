import { Matrix } from 'ml-matrix';
import { PCA } from 'ml-pca';
import { VisualizationModel } from '../index';
import linearProjection from '../d3/LinearProjection';
import VisualizationCollector from '../VisualizationsCollector';

class LinearProjectionModel extends VisualizationModel {
  // ritorna le coordinate dei punti proiettati sulle due componenti pca calcolate
  pca(options) {
    const data = this.dataModel
      .getFeatureColumns()
      .map((row) => Object.values(row));

    const pca = new PCA(data, options);

    const w64 = pca.getLoadings();
    const w = [];
    w64.data.map((d) => w.push(Array.from(d)));

    const x64 = pca.predict(data);
    const x = [];
    x64.data.map((d) => x.push(Array.from(d)));
    return { points: x, axis: (new Matrix(w)).transpose().to2DArray() };
  }

  getPreparedDataset({ normalization }) {
    this.dataModel.setNorm(normalization ? normalization.func : null);
    const projection = this.pca({ scale: true });

    const label = this.dataModel.getTargetColumns();

    const preparedPoints = [];
    projection.points
      .forEach((d, i) => preparedPoints
        .push({
          x: d[0],
          y: d[1],
          z: d[2],
          color: this.dataModel.targets.length > 0 ? label[i][this.dataModel.targets[0]] : null,
          size: this.dataModel.targets.length > 1 ? label[i][this.dataModel.targets[1]] : null,
        }));
    const preparedAxis = [];
    projection.axis
      .forEach((d) => preparedAxis
        .push([
          {
            x: 0,
            y: 0,
            z: 0,
          },
          {
            x: d[0],
            y: d[1],
            z: d[2],
          },
        ]));

    return {
      points: preparedPoints,
      axis: preparedAxis,
      feature: this.dataModel.features,
      target: this.dataModel.targets.length > 0 ? [...new Set(label.map((d) => d[this.dataModel.targets[0]]))] : null,
    };
  }
}

VisualizationCollector.addVisualization({
  id: 'linear',
  label: 'Linear Projection',
  model: new LinearProjectionModel(),
  visualization: linearProjection,
  options: { distance: false },
});

export default LinearProjectionModel;
