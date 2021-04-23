import forceField from '../model/d3/ForceField';
import linearProjection from '../model/d3/LinearProjection';
// import scatterPlotMatrix from '../model/d3/ScatterPlotMatrix';
import ForceFieldModel from '../model/VisualizationModels/ForceFieldModel';
import LinearProjectionModel from '../model/VisualizationModels/LinearProjectionModel';
// import ScatterPlotMatrixModel from '../model/VisualizationModels/ScatterPlotMatrixModel';

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

export { DistanceType };
