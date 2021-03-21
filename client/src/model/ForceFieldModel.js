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
      .map((value, index) => ({
        id: index,
        colore: value?.[this.dataModel.target[0]],
        forma: value?.[this.dataModel.target[1]],
        features: JSON.stringify(value),
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
        (distanceFrom, i) => {
          featureColumns
            .slice(i + 1, Math.min(maxLinks, featureColumns.length))
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
