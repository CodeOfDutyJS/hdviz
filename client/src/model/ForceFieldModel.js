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
    return this.dataModel.getTargetColumns()
      .map((value, index) => ({
        id: index,
        colore: value?.[this.dataModel.target[0]],
        forma: value?.[this.dataModel.target[1]],
      }))
      .slice(0, maxNodes);
  }

  static scale(data) {
    const max = data
      .reduce((prev, current) => (
        (prev.value > current.value) ? prev : current)).value;
    const min = data
      .reduce((prev, current) => (
        (prev.value < current.value) ? prev : current)).value;

    const scale = (num, inMin, inMax, outMin, outMax) => (
      (num - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;

    for (let i = 0; i < data.length; i++) {
      // eslint-disable-next-line no-param-reassign
      data[i]
        .value = scale(data[i].value, min, max, 1, 200);
    }

    return data;
  }

  getLinks(distanceFn, maxNodes, maxLinks, wantToScale) {
    const links = [];
    const featureColumns = this.dataModel.getFeatureColumns();
    featureColumns
      .slice(0, maxNodes)
      .forEach(
        (value, i) => {
          for (let j = i + 1; j < (maxLinks > featureColumns.length
            ? featureColumns.length : maxLinks); j++) {
            links.push(
              {
                source: i,
                target: j,
                value: distanceFn(Object.values(value), Object.values(featureColumns[j])),
              },
            );
          }
        },
      );

    return wantToScale ? this.constructor.scale(links) : links;
  }

  getPreparedDataset(distanceFn, maxNodes, maxLinks, wantToScale) {
    return {
      nodes: this.getNodes(maxNodes),
      links: this.getLinks(distanceFn, maxNodes, maxLinks, wantToScale),
    };
  }
}

export default ForceFieldModel;
