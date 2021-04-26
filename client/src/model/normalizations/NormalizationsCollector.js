class _NormalizationCollector {
    _normalizations = [];

    addNormalization({
      id,
      label,
      func,
    }) {
      this._normalizations = {
        ...this._normalizations,
        [id]: {
          id,
          label,
          func,
        },
      };
    }

    get normalizations() {
      return this._normalizations;
    }
}

const NormalizationCollector = new _NormalizationCollector();

NormalizationCollector.addNormalization({
  id: 'noNorm',
  label: 'No normalization',
  func: null,
});

export default NormalizationCollector;
