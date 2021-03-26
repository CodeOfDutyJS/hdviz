import * as d3 from 'd3';

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

  getNodes(maxNodes) {
    return this.dataModel.getSelectedDataset()
      .map((value) => ({
        color: value?.[this.dataModel.target[0]],
        size: value?.[this.dataModel.target[1]],
        features: JSON.stringify(value),
      }))
      .slice(0, maxNodes);
  }

  getLinks(distanceFn, maxNodes, maxLinks) {
    const links = [];
    const featureColumns = this.dataModel.getFeatureColumns();
    featureColumns
      .slice(0, maxNodes)
      .forEach(
        (distanceFrom, i) => {
          featureColumns
            .slice(i + 1, d3.min([maxLinks, featureColumns.length]))
            .forEach((distanceTo, j) => {
              const dist = distanceFn(Object.values(distanceFrom), Object.values(distanceTo));
              links.push(
                {
                  source: i,
                  target: j + i + 1,
                  value: dist,
                },
              );
            });
        },
      );
    return links;
  }

  getPreparedDataset(distanceFn, maxNodes, maxLinks) {
    return {
      nodes: this.getNodes(maxNodes),
      links: this.getLinks(distanceFn, maxNodes, maxLinks),
    };
  }
}

export default ForceFieldModel;
