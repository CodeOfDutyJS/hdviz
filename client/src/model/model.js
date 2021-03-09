/* eslint-disable max-len */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
import * as d3 from 'd3';
import * as mldistance from 'ml-distance';
import Dataset from './Dataset';

class Model {
  data = new Dataset();

  selectedData = new Dataset();

  label = {
    id: 'none',
    target: [],
    features: [],
  }

  selectedColumns = [];

  addProgressiveId() {
    for (let i = 0; i < this.selectedData.getData().nodes.length; i++) {
      const n = this.selectedData.getData().nodes[i];
      n.id = `node_${i}`;
    }
  }

  renameId() {
    for (let i = 0; i < this.selectedData.getData().nodes.length; i++) {
      const n = this.selectedData.getData().nodes[i];
      n.id = n[this.label.id];
      delete n[this.label.id];
    }
  }

  setId(a) {
    if (a === 'null' || a === 'undefined') return;
    this.label.id = a;
    if (this.label.id === 'progressive') {
      this.addProgressiveId();
    } else this.renameId();
  }

  setSelectedColumns(a) {
    if (a === this.selectedColumns) return;
    if (a == null) return;
    this.selectedColumns.length = 0;
    a.forEach(
      (ele) => this.selectedColumns.push(ele),
    );
    this.data.getData().nodes.forEach((row) => {
      Dataset.columnSelect(row, this.selectedColumns, (r) => {
        this.selectedData.addRow(r);
      });
    });
  }

  setFeatures(a) {
    this.label.features = a;
  }

  getFeatures() {
    return (this.label.features.slice());
  }

  setTarget(a) {
    this.label.target = a;
  }

  getTarget() {
    return (this.label.target.slice());
  }

  getSelectedColumns() {
    return this.selectedColumns.slice();
  }

  getSelectedData() {
    return this.selectedData.getData();
  }

  getLabel() {
    return Object.create(this.label);
  }

  async setEuclideanDistance(numberOfNodes, minDistance = 0) {
    this.selectedData.getData().links = [];
    for (let i = 0; i < numberOfNodes; i++) {
      for (let z = 1 + i; z < numberOfNodes; z++) {
        let m = 0;
        const obj1 = this.selectedData.getData().nodes[i];
        const obj2 = this.selectedData.getData().nodes[z];
        this.label.features.forEach((key) => {
          m += (obj1[key] - obj2[key]) ** 2;
        });
        m = Math.sqrt(m);
        if (m >= minDistance) {
          this.selectedData.getData().links.push(
            {
              source: obj1.id,
              target: obj2.id,
              distance: m,
            },
          );
        }
      }
    }
    this.selectedData.getData().nodes.length = numberOfNodes;
  }

  calculateDistance() {
    this.selectedData.getData().links = [];
    const a = -1;
    for (let i = 0; i < 150; i++) {
      const colore = this.selectedData.getData().nodes[i][this.label.target[0]];
      delete this.selectedData.getData().nodes[i][this.label.target[0]];
      for (let j = 1 + i; j < 150; j++) {
        const distance = mldistance.distance.euclidean(
          Object.values(this.selectedData.getData().nodes[i]),
          Object.values(this.selectedData.getData().nodes[j]),
        );
        if (distance > 1) {
          this.selectedData.getData().links.push(
            {
              source: `node_${i}`,
              target: `node_${j}`,
              value: distance,
            },
          );
        }
      }

      this.selectedData.getData().nodes[i].colore = colore;
    }

    const max = this.selectedData.getData().links.reduce((prev, current) => ((prev.value > current.value) ? prev : current)).value;
    const min = this.selectedData.getData().links.reduce((prev, current) => ((prev.value < current.value) ? prev : current)).value;

    // eslint-disable-next-line camelcase
    const scale = (num, in_min, in_max, out_min, out_max) => ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;

    for (let i = 0; i < this.selectedData.getData().links.length; i++) {
      this.selectedData.getData().links[i].value = scale(this.selectedData.getData().links[i].value, min, max, 1, 200);
    }

    this.selectedData.getData().nodes.length = 150;
  }

  setData(a) {
    this.reset();
    this.data.getData().nodes = a;
  }

  getData() {
    return this.data.getData();
  }

  reset() {
    this.data.dataFlush();
    this.selectedData.dataFlush();
  }

  resetSelected() {
    this.selectedData.dataFlush();
  }

}

/*
  class Model{
    constructor() {
      throw new Error('Use Model.getInstance()');
  }
  static getInstance() {
      if (!Model.instance) {
          Model.instance = new PrivateModel();
      }
      return Model.instance;
  }
  }
*/

export default Model;
