import { scatterPlotMatrix } from '../../../model/d3/index';
import { iris } from '../data/index';
import { ScatterPlotMatrixModel } from '../../../model/VisualizationModels/index';
import { DataModel } from '../../../model/index';

window.document.body.innerHTML = '<svg '
  + 'id="area" '
  + 'style={{ '
  + 'height: "100%", '
  + 'width: |"100%", '
  + 'marginRight: "0px", '
  + 'marginLeft: "0px", '
  + '}} '
  + '/>';
let dataModel = {};
let scatterPlotMatrixModel = {};

dataModel = new DataModel();
dataModel.dataset = iris;
dataModel.features = [
  'sepalLength',
  'sepalWidth',
  'petalLength',
  'petalWidth',
];
dataModel.targets = ['species'];
scatterPlotMatrixModel = new ScatterPlotMatrixModel();
scatterPlotMatrixModel.addData(dataModel);
const data = scatterPlotMatrixModel.getPreparedDataset({});
scatterPlotMatrix(data);

describe('#LinearProjection', () => {
  it('should have drawn correct number of squares and points', () => {
    expect(document.getElementsByClassName('circle').length).toBe(150 * 4 * 4);
    expect(document.getElementsByClassName('square').length).toBe(4 * 4);
  });
});
