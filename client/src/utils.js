const VisualizationType = {
  SCATTER_PLOT_MATRIX: 'matrix',
  HEATMAP: 'heatmap',
  CORRELATION_HEATMAP: 'correlation',
  FORCEFIELD: 'force',
  LINEAR_PROJECTION: 'projection',
  PARALLEL_COORDINATES: 'parallel',
};

const DistanceType = {
  EUCLIDEAN: 'euclidean',
  MANHATTAN: 'manhattan',
  PEARSONS: 'pearsons',
};

export const ClusteringType = {
  FEATURE: 'feature',
  COMPLETE: 'complete',
  SINGLE: 'single',
  UPGMA: 'upgma',
};

export { VisualizationType, DistanceType };
