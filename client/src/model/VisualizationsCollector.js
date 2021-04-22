class _VisualizationCollector {
  _visualizations = [];

  addVisualization({
    id, label, model, visualization, options,
  }) {
    this._visualizations = {
      ...this._visualizations,
      [id]: {
        id,
        label,
        model,
        visualization,
        options,
      },
    };
  }

  get visualizations() {
    return this._visualizations;
  }
}

const VisualizationCollector = new _VisualizationCollector();

export default VisualizationCollector;
