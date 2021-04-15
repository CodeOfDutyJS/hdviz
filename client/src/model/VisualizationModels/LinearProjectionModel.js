import * as mat from 'mathjs';
import { PCA } from 'ml-pca';
import { VisualizationModel } from '../index';

class LinearProjectionModel extends VisualizationModel {
  // calcola la trasposta di una matrice, ritorna solo le prime due colonne (i due componenti pca)
  // eslint-disable-next-line class-methods-use-this
  transpose(w) {
    // eslint-disable-next-line camelcase
    const w_t = [];
    for (let i = 0; i < w[0].length; i++) {
      w_t.push([w[0][i], w[1][i]]);
    }
    // eslint-disable-next-line camelcase
    return w_t;
  }

  // ritorna una matrice a partire da un array di oggetti
  // eslint-disable-next-line class-methods-use-this
  ObjectToMatrix(data) {
    const matrix = [];
    for (let i = 0; i < data.length; i++) {
      matrix.push([]);
      Object.keys(data[i]).map((j) => matrix[i].push(data[i][j]));
    }
    return matrix;
  }

  // rimuove le righe della matrice che contengono valori=null
  // eslint-disable-next-line class-methods-use-this
  /* removeNull(data) {
    let removed = false;
    for (let i = 0; i < data.length; i++) {
      for (let j = 0; j < data[i].length; j++) {
        if (data[i][j] == null || data[i][j] === undefined) {
          data.splice(i, 1);
          i -= 1;
          removed = true;
        }
      }
    }
    return removed;
  } */

  // eslint-disable-next-line class-methods-use-this
  range(data) {
    const max = data
      .reduce((prev, current) => (
        (prev > current) ? prev : current));
    const min = data
      .reduce((prev, current) => (
        (prev < current) ? prev : current));
    return {
      // eslint-disable-next-line object-shorthand
      min: min,
      // eslint-disable-next-line object-shorthand
      max: max,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  mean(data) {
    let meanx = 0;
    let meany = 0;

    data.forEach((d) => { meanx += d.x; meany += d.y; });
    return {
      meanx: meanx / data.length,
      meany: meany / data.length,
    };
  }

  // ritorna le coordinate dei punti proietatti sulle due componenti pca calcolate
  pca(data, option) {
    const pca = new PCA(data, option);

    const w64 = pca.getLoadings();
    const w = [];
    w64.data.map((d) => w.push(Array.from(d)));

    const x64 = pca.predict(data);
    const x = [];
    x64.data.map((d) => x.push(Array.from(d)));
    // eslint-disable-next-line camelcase
    const w_t = this.transpose(w);
    return { points: x, axis: w_t };
  }

  getPreparedDataset() {
    let projection = {};

    // eslint-disable-next-line max-len
    projection = this.pca(this.ObjectToMatrix(this.dataModel.getFeatureColumns()), { scale: true });

    const label = this.dataModel.getTargetColumns();

    const preparedPoints = [];
    // eslint-disable-next-line no-undef
    projection.points
      .map((d, i) => preparedPoints
        .push({
          x: d[0],
          y: d[1],
          colore: this.dataModel.targets.length > 0 ? label[i][this.dataModel.targets[0]] : null,
          forma: this.dataModel.targets.length > 1 ? label[i][this.dataModel.targets[1]] : null,
        }));
    const preparedAxis = [];
    projection.axis
      .map((d, i) => preparedAxis
        .push({
          x: d[0],
          y: d[1],
          label: this.dataModel.features[i],
        }));

    return {
      points: preparedPoints,
      axis: preparedAxis,
      rangeX: this.range(preparedPoints.map((d) => d.x)),
      rangeY: this.range(preparedPoints.map((d) => d.y)),
      mean: this.mean(preparedPoints),
    };
  }
}

export default LinearProjectionModel;
