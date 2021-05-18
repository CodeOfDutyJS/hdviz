import { parallelCoordinates } from '../../../model/d3/index';
import { iris } from '../data/index';
import { ParallelCoordinatesModel } from '../../../model/VisualizationModels/index';
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
let parallelCoordinatesModel = {};

dataModel = new DataModel();
dataModel.dataset = iris;
dataModel.features = [
  'sepalLength',
  'sepalWidth',
  'petalLength',
  'petalWidth',
];
dataModel.targets = ['species'];
parallelCoordinatesModel = new ParallelCoordinatesModel();
parallelCoordinatesModel.addData(dataModel);
const data = parallelCoordinatesModel.getPreparedDataset();
parallelCoordinates(data);

describe('#ParallelCoordinates', () => {
  it('should have drawn correct number of axes and points', () => {
    expect(document.getElementsByTagName('path').length).toBe(154);
    expect(document.getElementsByClassName('domain').length).toBe(4);
  });
});
