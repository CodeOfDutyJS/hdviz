import clearVisualization from '../model/d3/ClearVisualization';
import correlationHeatmap from '../model/d3/CorrelationHeatmap';
import forceField from '../model/d3/ForceField';
import heatmap from '../model/d3/Heatmap';
import linearProjection from '../model/d3/LinearProjection';
import scatterPlotMatrix from '../model/d3/ScatterPlotMatrix';
import ForceFieldModel from '../model/VisualizationModels/ForceFieldModel';
// eslint-disable-next-line import/no-cycle
import HeatMapModel from '../model/VisualizationModels/HeatMapModel';
import CorrelationHeatmapModel from '../model/VisualizationModels/CorrelationHeatmapModel';
import LinearProjectionModel from '../model/VisualizationModels/LinearProjectionModel';
import ScatterPlotMatrixModel from '../model/VisualizationModels/ScatterPlotMatrixModel';

const VisualizationType = {
  SCATTER_PLOT_MATRIX: {
    id: 'matrix',
    label: 'Scatter Plot Matrix',
    model: new ScatterPlotMatrixModel(),
    before: clearVisualization,
    visualization: scatterPlotMatrix,
  },
  HEATMAP: {
    id: 'heatmap',
    label: 'Heatmap',
    model: new HeatMapModel(),
    before: clearVisualization,
    visualization: heatmap,
  },
  CORRELATION_HEATMAP: {
    id: 'correlation',
    label: 'Correlation Heatmap',
    model: new CorrelationHeatmapModel(),
    before: clearVisualization,
    visualization: correlationHeatmap,
  },
  FORCEFIELD: {
    id: 'force',
    label: 'Force Field',
    model: new ForceFieldModel(),
    before: clearVisualization,
    visualization: forceField,
  },
  LINEAR_PROJECTION: {
    id: 'projection',
    label: 'Linear Projection',
    model: new LinearProjectionModel(),
    before: clearVisualization,
    visualization: linearProjection,
  },
  PARALLEL_COORDINATES: {
    id: 'parallel',
    label: 'Parallel Coordinates',
  },
};

// eslint-disable-next-line import/prefer-default-export
export { VisualizationType };
