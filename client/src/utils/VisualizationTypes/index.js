let _visualizations;

export default {
  addVisualization({
    id, label, model, visualization, options,
  }) {
    _visualizations = {
      ..._visualizations,
      [id]: {
        id,
        label,
        model,
        visualization,
        options,
      },
    };
  },

  get visualizations() {
    return _visualizations;
  },
};
