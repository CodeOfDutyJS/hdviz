import { Matrix } from 'ml-matrix';
import max from 'ml-array-max';
import min from 'ml-array-min';
import { PCA } from 'ml-pca';
import VisualizationModel from '../VisualizationModel';

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

  getPreparedDataset() {
    const projection = this.pca({ scale: true });

    const label = this.dataModel.getTargetColumns();

    const preparedPoints = [];
    projection.points
      .map((d, i) => preparedPoints
        .push({
          x: d[0],
          y: d[1],
          color: this.dataModel.targets.length > 0 ? label[i][this.dataModel.targets[0]] : null,
          size: this.dataModel.targets.length > 1 ? label[i][this.dataModel.targets[1]] : null,
        }));
    const preparedAxis = [];
    projection.axis
      .map((d, i) => preparedAxis
        .push({
          x: d[0],
          y: d[1],
          label: this.dataModel.features[i],
        }));

    const xPoints = preparedPoints.map((d) => d.x);
    const yPoints = preparedPoints.map((d) => d.y);
    const xAxis = preparedAxis.map((d) => d.x);
    const yAxis = preparedAxis.map((d) => d.y);

    return {
      points: preparedPoints,
      axis: preparedAxis,
      points_rangeX: [min(xPoints), max(xPoints)],
      points_rangeY: [min(yPoints), max(yPoints)],
      axis_rangeX: [min(xAxis), max(xAxis)],
      axis_rangeY: [min(yAxis), max(yAxis)],
      target: this.dataModel.targets.length > 0 ? [...new Set(label.map((d) => d[this.dataModel.targets[0]]))] : null,
    };
  }
}

export default LinearProjectionModel;
