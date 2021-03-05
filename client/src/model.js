/* eslint-disable no-restricted-properties */
/* eslint-disable no-plusplus */
/* eslint-disable max-classes-per-file */
import { PoweroffOutlined } from '@ant-design/icons';
import * as d3 from 'd3';

class Dataset {
  // constructor() {}

  data = {
    nodes: [],
    links: [],
  }

  addRow(row, next) {
    this.data.nodes.push(row);
    if (next) {
      next(row);
    }
  }

  addData(a) {
    this.data.nodes = a;
  }

  static columnSelect(d, a, next) {
    const row = {};
    let i;
    for (i = 0; i < a.length; i++) {
      row[a[i]] = d[a[i]];
    }
    if (next) {
      next(row);
    }
  }

  getData() { return (this.data); }

  dataFlush() {
    this.data.nodes.length = 0;
    this.data.links.length = 0;
  }
}

class PrivateModel {
  // constructor() {}

  data = new Dataset();

  selectedData = new Dataset();

  label = {
    id: 'none',
  }

  selectedColumns = []

  /*
  addProgressiveId(next) {
    for (let i = 0; i < this.selectedData.getData().nodes.length; i++) {
      const n = this.selectedData.getData().nodes[i];
      n.id = `node_${i}`;
    }
    if (next) {
      next(row); CHE CAZZO È?
    }
  }
  */

  renameId(next) {
    for (let i = 0; i < this.selectedData.getData().nodes.length; i++) {
      const n = this.selectedData.getData().nodes[i];
      n.id = n[this.label.id];
      delete n[this.label.id];
    }
    if (next) {
      next(row);
    }
  }

  setId(a) {
    if (a === this.label.id || a === 'null' || a === 'undefined') return;
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
      const newRow = Object.create(row);
      Dataset.columnSelect(newRow, this.selectedColumns, (r) => {
        this.selectedData.addRow(r);
      });
    });
  }

  getSelectedColumns() {
    return this.selectedColumns.slice();
  }

  getSelectedData() {
    return (this.selectedData.getData());
  }

  // eslint-disable-next-line class-methods-use-this
  getLabel() {
    return {
      id: this.label.id.slice(),
    };
  }

  async setEuclideanDistance(numberOfNodes, minDistance = 0) {
    this.selectedData.getData().links = [];
    for (let i = 0; i < numberOfNodes; i++) {
      for (let z = 1 + i; z < numberOfNodes; z++) {
        let m = 0;
        const obj1 = this.selectedData.getData().nodes[i];
        const obj2 = this.selectedData.getData().nodes[z];
        this.selectedColumns.forEach((key) => {
          m += Math.pow(obj1[key] - obj2[key], 2);
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
}

class Model {
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

export default Model;
