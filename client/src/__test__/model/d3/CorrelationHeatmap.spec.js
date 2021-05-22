import { correlationHeatmap } from '../../../model/d3/index';
import { iris } from '../data/index';
import { HeatMapModel } from '../../../model/VisualizationModels/index';
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
  normalization: null, initialColor: 'fff', finalColor: 'fff', initialRangeValue: -3, finalRangeValue: 3,
});
correlationHeatmap(data);

describe('#correlation Heatmap', () => {
  it('should draw the correct number of rects', () => {
    expect(document.getElementsByClassName('heatmapRect').length).toStrictEqual(16);
  });
});
