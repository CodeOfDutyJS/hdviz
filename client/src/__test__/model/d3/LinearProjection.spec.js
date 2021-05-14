import { linearProjection } from '../../../model/d3/index';
import { iris } from '../data/index';
import { LinearProjectionModel } from '../../../model/VisualizationModels/index';
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
let linearProjectionModel = {};

dataModel = new DataModel();
dataModel.dataset = iris;
dataModel.features = [
  'sepalLength',
  'sepalWidth',
  'petalLength',
  'petalWidth',
];
dataModel.targets = ['species'];
linearProjectionModel = new LinearProjectionModel();
linearProjectionModel.addData(dataModel);
const data = linearProjectionModel.getPreparedDataset({});
linearProjection(data);

describe('#LinearProjection', () => {
  it('should have drawn correct number of axes and points', () => {
    expect(document.getElementsByClassName('_3d points').length).toBe(150);
    expect(document.getElementsByClassName('_3d lines').length).toBe(4);
  });
});
