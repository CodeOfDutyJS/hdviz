import { distance } from 'ml-distance';
import { forceField } from '../../../model/d3/index';
import { iris } from '../data/index';
import { ForceFieldModel } from '../../../model/VisualizationModels/index';
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
let forceFieldModel = {};

dataModel = new DataModel();
dataModel.dataset = iris;
dataModel.features = [
  'sepalLength',
  'sepalWidth',
  'petalLength',
  'petalWidth',
];
dataModel.targets = ['species'];
forceFieldModel = new ForceFieldModel();
forceFieldModel.addData(dataModel);
const data = forceFieldModel.getPreparedDataset({
  distanceFn: distance.euclidean,
});
forceField(data);

describe('#ForceField', () => {
  it('should have exact number of circles', () => {
    expect(document.getElementsByTagName('path').length).toBe(150);
  });
});
