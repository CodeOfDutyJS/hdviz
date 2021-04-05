import * as d3 from 'd3';
import forceField from './d3/ForceField';

class ForceFieldModel {
  get dataModel() {
    return this._dataModel;
  }

  set dataModel(value) {
    this._dataModel = value;
  }

  addData(data) {
    console.log(data);
    this._dataModel = data;
    return this;
  }

  getNodes(maxNodes) {
    console.log(this.dataModel.targets[1]);
    return this.dataModel.getSelectedDataset()
      .map((value) => ({
        color: this.dataModel.targets.length > 0 ? value?.[this.dataModel.targets[0]] : null,
        size: this.dataModel.targets.length > 1 ? value?.[this.dataModel.targets[1]] : null,
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

  getPreparedDataset({ distanceFn, maxNodes, maxLinks }) {
    return {
      nodes: this.getNodes(maxNodes),
      links: this.getLinks(distanceFn, maxNodes, maxLinks),
    };
  }
}

export default ForceFieldModel;
