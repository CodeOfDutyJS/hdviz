import { distance } from 'ml-distance';
import { correlation } from 'ml-matrix';
import { DistanceType, ClusteringType } from '../../utils/options';
import { VisualizationModel } from '../index';
import heatmap from '../d3/Heatmap';
import VisualizationCollector from '../VisualizationsCollector';

class HeatMapModel extends VisualizationModel {
  constructor(dataModel, distanceFn = distance.euclidean) {
    super();
    this._distanceFn = distance.euclidean;
  }

  setDistance(distanceFn) {
    this._distanceFn = distanceFn;
    return this;
  }

  distanceCalculator(a, b) {
    const feats = this.dataModel.features;
    const aValues = [];
    const bValues = [];
    feats.forEach((value) => {
      aValues.push(a[value]);
      bValues.push(b[value]);
    });
    return this._distanceFn(aValues, bValues);
  }

  getCorrelationMatrix() {
    const d = this.dataModel.getFeatureColumns();
    const cols = this.dataModel.features;
    const m = d.map((obj) => Object.values(obj));
    let c = correlation(m);
    c = c.to2DArray();
    const matrix = [];
    for (let z = 0; z < cols.length; z++) {
      const entry = {
        ref: {
          id: 'a',
        },
        distances: [],
      };
      for (let i = 0; i < cols.length; i++) {
        entry.ref.id = cols[z];
        entry.ref[cols[i]] = c[z][i];
        entry.distances.push(Math.sqrt(2 * (1 - c[z][i])));
      }
      matrix.push(entry);
    }
    return (matrix);
  }

  getDistanceMatrix() {
    const data = this.dataModel.getSelectedDataset();
    const matrix = [];
    data.forEach((row) => {
      if (Object.entries(row).length === 0) return;
      const rowDistance = [];
      data.forEach((column) => {
        if (Object.entries(row).length === 0) return;
        // eslint-disable-next-line eqeqeq
        if (row != column) {
          rowDistance.push(this.distanceCalculator(row, column));
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

  getAlphaticallySorted() {
    const col = this.dataModel.targets[0];
    const d = this.dataModel.getSelectedDataset();
    d.sort((a, b) => {
      const IdA = a[col].toUpperCase(); // ignore upper and lowercase
      const IdB = b[col].toUpperCase(); // ignore upper and lowercase
      if (IdA < IdB) {
        return -1;
      }
      if (IdA > IdB) {
        return 1;
      }
      return 0;
    });
    return {
      children: d,
    };
  }

  getLinkage(clusteringType) {
    const matrix = this.getMatrix();
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
          if (clusteringType === ClusteringType.SINGLE) {
            if (dista < dist[i]) dist[i] = dista;
          }
          if (clusteringType === ClusteringType.COMPLETE) {
            if (dista > dist[i]) dist[i] = dista;
          }
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

  getMatrix() {
    if (DistanceType.PEARSONS === this._distanceFn) {
      return this.getCorrelationMatrix();
    }
    return this.getDistanceMatrix();
  }

  getPreparedDataset({ distanceFn = DistanceType.PEARSONS, clusteringType = ClusteringType.SINGLE }) {
    this.setDistance(DistanceType.PEARSONS);
    if (clusteringType === ClusteringType.ALPHABETICAL) {
      return {
        cluster: this.getAlphaticallySorted(),
        clusterCols: this.getLinkage(ClusteringType.SINGLE),
        targetCols: this.dataModel.targets,
        selectedTarget: this.dataModel.getTargetColumns(),
      };
    }

    const cols = this.getLinkage(clusteringType);
    this.setDistance(distanceFn);
    return {
      cluster: this.getLinkage(clusteringType),
      clusterCols: cols,
      targetCols: this.dataModel.targets,
      selectedTarget: this.dataModel.getTargetColumns(),
    };
  }
}

export default HeatMapModel;

VisualizationCollector.addVisualization({
  id: 'heatmap',
  label: 'Heatmap',
  model: new HeatMapModel(),
  visualization: heatmap,
  options: { distance: true },
});
