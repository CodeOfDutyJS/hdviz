import { heatmap } from '../../../model/d3/index';
import { iris } from '../data/index';
import { HeatMapModel } from '../../../model/VisualizationModels/index';
import { DataModel } from '../../../model/index';
import { distance } from 'ml-distance';

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
let heatmapModel = {};

dataModel = new DataModel();
dataModel.dataset = iris;
dataModel.features = [
  'sepalLength',
  'sepalWidth',
  'petalLength',
  'petalWidth',
];
dataModel.targets = ['species'];
heatmapModel = new HeatMapModel();
heatmapModel.addData(dataModel);
const data = heatmapModel.getPreparedDataset({
  normalization: null, initialColor: 'fff', finalColor: 'fff', initialRangeValue: -3, finalRangeValue: 3, distanceFn: distance.euclidean,
});
heatmap(data);
describe('#heatmap', () => {
  it('should draw correctly', () => {
    expect(document.getElementsByClassName('heatmapRect').length).toStrictEqual(600);
  });
});
