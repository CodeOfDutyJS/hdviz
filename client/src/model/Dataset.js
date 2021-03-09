export default class Dataset {
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
