import { distance } from 'ml-distance';
import * as jeezy from 'jeezy';
import { DistanceType, ClusteringType } from '../utils';

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
    const matrix = [];
    for (let z = 0; z < cols.length; z++) {
      const entry = {
        ref: {
          id: 'a',
        },
        distances: [],
      };
      for (let i = 0; i < cols.length; i++) {
        entry.ref.id = corr[z * cols.length + i].column_x;
        entry.ref[corr[z * cols.length + i].column_y] = corr[z * cols.length + i].correlation;
        entry.distances.push(Math.sqrt(2 * (1 - corr[z * cols.length + i].correlation)));
      }
      matrix.push(entry);
    }
    return (matrix);
  }

  getDistanceMatrix(distanceFn) {
    const data = this.dataModel.getStandardScore();
    const matrix = [];
    data.forEach((row) => {
      if (Object.entries(row).length === 0) return;
      const rowDistance = [];
      data.forEach((column) => {
        if (Object.entries(row).length === 0) return;
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
    return matrix;
  }

  getSimpleLinkage(distanceFn) {
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
        }
      });
      // now that you have the minimum build the cluster
      const r = matrix[indexes[1]];
      const l = 'branchLength' in r ? r.branchLength : 0;
      const cluster = {
        id: `cluster${n}`,
        branchLength: (min / 2) - l,
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
        return this.getSimpleLinkage(d);
      default:
        return this.getSimpleLinkage(d);
    }
  }

  static correlationMap(cluster) {
    const leaves = HeatMapModel.getLeaves(cluster);
    const colnames = [];
    leaves.forEach((leaf) => colnames.push(leaf.id));
    const toGrid = [];
    let row = 1;
    leaves.forEach((leaf) => {
      let col = 1;
      colnames.forEach((name) => {
        const obj = {};
        obj.row = row;
        obj.col = col;
        obj.column_x = leaf.id;
        obj.column_y = name;
        obj.correlation = leaf[name];
        toGrid.push(obj);
        col += 1;
      });
      row += 1;
    });
    return toGrid;
  }

  static dataGrid(cluster, cols) {
    const leaves = HeatMapModel.getLeaves(cluster);
    const colnames = cols;
    const toGrid = [];
    let row = 1;
    leaves.forEach((leaf) => {
      let col = 1;
      colnames.forEach((name) => {
        const obj = {};
        obj.row = row;
        obj.col = col;
        // obj.column_x = leaf.id; optional ? on larger datasets cant even read row names
        obj.column_y = name;
        obj.value = leaf[name];
        toGrid.push(obj);
        col += 1;
      });
      row += 1;
    });
    return toGrid;
  }

  static getLeaves(cluster) {
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
