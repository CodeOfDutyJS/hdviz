import * as mat from 'mathjs';
import { PCA } from 'ml-pca';

class LinearProjectionModel {
  constructor(dataModel) {
    this._dataModel = dataModel;
  }

  get dataModel() {
    return this._dataModel;
  }

  set dataModel(value) {
    this._dataModel = value;
  }

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

  // rimuove le righe della matrice che contengono valori=null
  // eslint-disable-next-line class-methods-use-this
  removeNull(data) {
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
  }

  // ritorna le coordinate dei punti proietatti sulle due componenti pca calcolate
  pca(data, option) {
    const pca = new PCA(data, option);

    const w64 = pca.getEigenvectors();
    const w = [];
    w64.data.map((d) => w.push(Array.from(d)));
    const x = this.dataModel.Object_to_Matrix(data);
    // eslint-disable-next-line camelcase
    const w_t = this.transpose(w);
    return { points: mat.multiply(x, w_t), axes: w_t };
  }

  getPreparedDataset(covariance) {
    const dataset = this.dataModel.getSelectedDataset();
    let projection = {};
    if (covariance) {
      projection = this.pca(
        this.dataModel.computeCorrelationMatrix(dataset, this.dataModel.getFeatureColumns()),
        {
          method: 'covarianceMatrix',
          isCovarianceMatrix: true,
        },
      );
    } else {
      projection = this.pca(dataset);
    }
    console.log(dataset);
    console.log(projection);

    /*
    const preparedDataset=dataset
    projection.points.map(v => {preparedDataset.x=v[0]; preparedDataset.y=v[1] })

    */
  }
}

export default LinearProjectionModel;
