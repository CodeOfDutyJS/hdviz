import { umap } from '../../../model/d3/index';
import { iris } from '../data/index';
import { UmapModel } from '../../../model/VisualizationModels/index';
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
let umapModel = {};

dataModel = new DataModel();
dataModel.dataset = iris;
dataModel.features = [
  'sepalLength',
  'sepalWidth',
  'petalLength',
  'petalWidth',
];
dataModel.targets = ['species'];
umapModel = new UmapModel();
umapModel.addData(dataModel);
const data = umapModel.getPreparedDataset({ nNeighbors: 15, minDistance: 0.1, spread: 1 });
umap(data);
describe('#Umap', () => {
  it('should draw the correct number of points', () => {
    expect(document.getElementsByClassName('_3d points').length).toStrictEqual(150);
  });
});
