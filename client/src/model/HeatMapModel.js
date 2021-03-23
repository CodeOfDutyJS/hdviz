import { distance } from 'ml-distance';
import { DistanceType, ClusteringType } from '../utils';

const jeezy = require('jeezy');

class HeatMapModel {
  constructor(dataModel) {
    this._dataModel = dataModel;
  }

  get dataModel() {
    return this._dataModel;
  }

  set dataModel(value) {
    this._dataModel = value;
  }

  distance(a, b, distanceFn) {
    const feats = this.dataModel.feature;
    const aValues = [];
    const bValues = [];
    feats.forEach((value) => {
      aValues.push(a[value]);
      bValues.push(b[value]);
    });
    return distanceFn(aValues, bValues);
  }

  getCorrelationMatrix() {
    const data = this.dataModel.getSelectedDataset();
    const cols = this.dataModel.feature;
    const corr = jeezy.arr.correlationMatrix(data, cols);
    console.log(corr);
    const matrix = [];
    for (let z = 0; z < cols.length; z++) {
      const entry = {
        ref: {
          id: 'a',
          children: [],
        },
        distances: [],
      };
      for (let i = 0; i < cols.length; i++) {
        entry.ref.id = corr[z * cols.length + i].column_x;
        entry.ref.children.push(corr[z * cols.length + i]);
        entry.distances.push(corr[z * cols.length + i].correlation);
      }
      matrix.push(entry);
    }
    return (matrix);
  }

  getDistanceMatrix(distanceFn) {
    const data = this.dataModel.getSelectedDataset();
    const matrix = [];
    data.forEach((row) => {
      const rowDistance = [];
      data.forEach((column) => {
        // eslint-disable-next-line eqeqeq
        if (row != column) {
          rowDistance.push(this.distance(row, column, distanceFn));
        } else {
          rowDistance.push(0);
        }
      });
      matrix.push({
        ref: row,
        distances: [...rowDistance],
      });
    });
    console.log(matrix);
    return matrix;
  }

  getSimpleLinkage(distanceFn) {
    const matrix = this.getMatrix(distanceFn);
    let n = 0;
    console.log(matrix);
    while (matrix.length !== 1) {
      let min = Infinity;
      const indexes = [];
      // get the current minimum
      matrix.forEach((value, index) => {
        for (let i = index + 1; i < value.distances.length; i++) {
          if (value.distances[i] < min) {
            min = value.distances[i];
            indexes.length = 0;
            indexes.push(index);
            indexes.push(i);
          }
        }
      });
      // now that you have the minimum build the cluster
      const cluster = {
        id: `cluster${n}`,
        branchLength: min / 2,
        children: [],
      };
      indexes.forEach((index) => {
        cluster.children.push({ ...matrix[index].ref });
      });
      // calculate the distances
      const dist = matrix[indexes[0]].distances.slice();
      indexes.forEach((index) => {
        const entry = matrix[index].distances;
        entry.forEach((dista, i) => {
          if (dista < dist[i]) dist[i] = dista;
        });
      });
      matrix.forEach((row, index) => {
        row.distances.push(dist[index]);
      });
      dist.push(Infinity);
      // note: distances are yet not done
      const matrixEntry = {
        ref: { ...cluster },
        distances: [...dist],
      };
      matrix.push(matrixEntry);
      indexes.sort((a, b) => b - a);
      indexes.forEach((index) => {
        matrix.splice(index, 1);
        matrix.forEach((entry) => {
          entry.distances.splice(index, 1);
        });
      });
      // should be fine;
      n += 1;
    }
    return matrix[0].ref;
  }

  getCompleteLinkage(distanceFn) {
    const matrix = this.getMatrix(distanceFn);
    let n = 0;
    while (matrix.length !== 1) {
      let min = Infinity;
      const indexes = [];
      // get the current minimum
      matrix.forEach((value, index) => {
        for (let i = index + 1; i < value.distances.length; i++) {
          if (value.distances[i] < min) {
            min = value.distances[i];
            indexes.length = 0;
            indexes.push(index);
            indexes.push(i);
          }
          /* if (!indexes.includes(i) && value.distances[i] === min) {
            indexes.push(i);
          } */
        }
      });
      // now that you have the minimum build the cluster
      const cluster = {
        id: `cluster${n}`,
        branchLength: min / 2,
        children: [],
      };
      indexes.forEach((index) => {
        cluster.children.push({ ...matrix[index].ref });
      });
      // calculate the distances
      const dist = matrix[indexes[0]].distances.slice();
      indexes.forEach((index) => {
        const entry = matrix[index].distances;
        entry.forEach((dista, i) => {
          if (dista > dist[i]) dist[i] = dista;
        });
      });
      matrix.forEach((row, index) => {
        row.distances.push(dist[index]);
      });
      dist.push(Infinity);
      // note: distances are yet not done
      const matrixEntry = {
        ref: { ...cluster },
        distances: [...dist],
      };
      matrix.push(matrixEntry);
      indexes.sort((a, b) => b - a);
      indexes.forEach((index) => {
        matrix.splice(index, 1);
        matrix.forEach((entry) => {
          entry.distances.splice(index, 1);
        });
      });
      // should be fine;
      n += 1;
    }
    return matrix[0].ref;
  }

  getMatrix(distanceType) {
    switch (distanceType) {
      case DistanceType.EUCLIDEAN:
        console.log('b');
        return this.getDistanceMatrix(distance.euclidean);
        // eslint-disable-next-line no-unreachable
        break;
      case DistanceType.PEARSONS:
        return this.getCorrelationMatrix();
        // eslint-disable-next-line no-unreachable
        break;
      default:
        return this.getDistanceMatrix(distance.euclidean);
    }
  }

  getClustering(clusteringType, d) {
    switch (clusteringType) {
      case ClusteringType.COMPLETE:
        return this.getCompleteLinkage(d);
      case ClusteringType.SIMPLE:
        console.log('a');
        return this.getSimpleLinkage(d);
      default:
        return this.getSimpleLinkage(d);
    }
  }

  getLeaves(cluster) {
    let leaves = [];
    if (!cluster.children) {
      leaves.push(cluster);
      return leaves;
    }
    cluster.children.forEach((value) => {
      leaves = leaves.concat(this.getLeaves(value));
    });
    return leaves;
  }
}

/*
matrix = [
  {
    cluster: {},
    distances: []
  },
  {
    cluster: {}
    distances: [],
  }
]

the distance matrix always is n colunms and n rows, easy to update on removal
and when adding elements, as long as we push on the end.
*/

export default HeatMapModel;
