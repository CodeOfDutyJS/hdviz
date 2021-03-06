import { distance } from 'ml-distance';
import { correlation } from 'ml-matrix';
import { DistanceType, ClusteringType } from '../../utils/options';
import { VisualizationModel } from '../index';
import heatmap from '../d3/Heatmap';
import VisualizationCollector from '../VisualizationsCollector';

class HeatMapModel extends VisualizationModel {
  constructor(dataModel, distanceFn = distance.euclidean) {
    super();
    this._distanceFn = distanceFn;
  }

  setDistance(distanceFn) {
    this._distanceFn = distanceFn;
    return this;
  }

  getLeavesNumber(cluster) {
    let leavesN = 0;
    if (!cluster.children) {
      return 1;
    }
    cluster.children.forEach((value) => {
      leavesN += this.getLeavesNumber(value);
    });
    return leavesN;
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

  getAlphabeticallySorted() {
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
      // const r = matrix[indexes[1]];
      // const l = 'branchLength' in r ? r.branchLength : 0;
      const cluster = {
        id: `cluster${n}`,
        children: [],
      };
      indexes.forEach((index) => {
        cluster.children.push({ ...matrix[index].ref });
      });
      // calculate the distances
      const dist = matrix[indexes[0]].distances.slice();
      const clusterElementNumber = this.getLeavesNumber(matrix[indexes[0]].ref) + this.getLeavesNumber(matrix[indexes[1]].ref);
      indexes.forEach((index) => {
        const entry = matrix[index].distances;
        entry.forEach((dista, i) => {
          if (clusteringType === ClusteringType.SINGLE) {
            if (dista < dist[i]) dist[i] = dista;
          }
          if (clusteringType === ClusteringType.COMPLETE) {
            if (dista > dist[i]) dist[i] = dista;
          }
          if (clusteringType === ClusteringType.UPGMA) {
            dist[i] = matrix[indexes[0]].distances[i] + matrix[indexes[1]].distances[i] / clusterElementNumber;
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

  getPreparedDataset({
    normalization, initialColor, finalColor, initialRangeValue, finalRangeValue, distanceFn = DistanceType.PEARSONS, clustering = ClusteringType.UPGMA,
  }) {
    this.dataModel.setNorm(normalization ? normalization.func : null);
    this.setDistance(DistanceType.PEARSONS);
    if (clustering === ClusteringType.ALPHABETICAL) {
      return {
        cluster: this.getAlphabeticallySorted(),
        clusterCols: this.getLinkage(ClusteringType.SINGLE),
        targetCols: this.dataModel.targets,
        selectedTarget: this.dataModel.getTargetColumns(),
        color: [initialColor, '#FFF', finalColor],
        heatmapRange: [initialRangeValue, finalRangeValue],
      };
    }

    const cols = this.getLinkage(clustering);
    this.setDistance(distanceFn);
    return {
      cluster: this.getLinkage(clustering),
      clusterCols: cols,
      targetCols: this.dataModel.targets,
      selectedTarget: this.dataModel.getTargetColumns(),
      color: [initialColor, '#FFF', finalColor],
      heatmapRange: [initialRangeValue, finalRangeValue],
    };
  }
}

export default HeatMapModel;

VisualizationCollector.addVisualization({
  id: 'heatmap',
  label: 'Heatmap',
  model: new HeatMapModel(),
  visualization: heatmap,
  options: {
    distance: true, clustering: true, color: true, range: true,
  },
});
