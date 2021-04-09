import forceField from '../model/d3/ForceField';
import linearProjection from '../model/d3/LinearProjection';
import scatterPlotMatrix from '../model/d3/ScatterPlotMatrix';
import ForceFieldModel from '../model/VisualizationModels/ForceFieldModel';
import LinearProjectionModel from '../model/VisualizationModels/LinearProjectionModel';
import ScatterPlotMatrixModel from '../model/VisualizationModels/ScatterPlotMatrixModel';

const VisualizationType = {
  SCATTER_PLOT_MATRIX: {
    id: 'matrix',
    label: 'Scatter Plot Matrix',
    model: new ScatterPlotMatrixModel(),
    visualization: scatterPlotMatrix,
  },
  HEATMAP: {
    id: 'heatmap',
    label: 'Heatmap',
  },
  CORRELATION_HEATMAP: {
    id: 'correlation',
    label: 'Correlation Heatmap',
  },
  FORCEFIELD: {
    id: 'force',
    label: 'Force Field',
    model: new ForceFieldModel(),
    visualization: forceField,
  },
  LINEAR_PROJECTION: {
    id: 'projection',
    label: 'Linear Projection',
    model: new LinearProjectionModel(),
    visualization: linearProjection,
  },
  PARALLEL_COORDINATES: {
    id: 'parallel',
    label: 'Parallel Coordinates',
  },
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
