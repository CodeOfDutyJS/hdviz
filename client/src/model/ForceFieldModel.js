const DataModel = require('./DataModel');

class ForceFieldModel {
  constructor(dataModel) {
    this._dataModel = dataModel;
  }

  get dataModel() {
    return this._dataModel;
  }

  set dataModel(value) {
    this._dataModel = value;
  }

  getNodes() {
    return this.dataModel.getFeatureColumns()
      .map((value, index) => ({
        id: index,
        features: Object.keys(value)
          .map((key) => `${key}: ${value[key]}`)
          .join(', '),
      }));
  }

  getLinks(distanceFn) {
    const links = [];
    const targetColumns = this.dataModel.getTargetColumns();
    targetColumns.forEach((value, index) => {
      for (let i = index + 1; i < targetColumns.length; i++) {
        links.push(
          {
            source: index,
            target: i,
            value: distanceFn(Object.values(value), Object.values(targetColumns[i])),
          },
        );
      }
    });
    return links;
  }

  getPreparedDataset(distanceFn) {
    return {
      nodes: this.getNodes(),
      links: this.getLinks(distanceFn),
    };
  }
}

export default ForceFieldModel;
