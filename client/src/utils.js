const VisualizationType = {
  MATRIX: 'matrix',
  HEATMAP: 'heatmap',
  CORRELATION: 'correlation',
  FORCE: 'force',
  PROJECTION: 'projection',
  PARALLEL: 'parallel',
};

const DistanceType = {
  EUCLIDEAN: 'euclidean',
  MANHATTAN: 'manhattan',
  PEARSONS: 'pearsons',
};

export const ClusteringType = {
  FEATURE: 'feature',
  COMPLETE: 'complete',
  SIMPLE: 'simple',
  UPGMA: 'upgma',
};

export { VisualizationType, DistanceType };
