import * as d3 from 'd3';
import forceField from '../d3/ForceField';
import { VisualizationModel } from '../index';
import VisualizationCollector from '../VisualizationsCollector';

class ForceFieldModel extends VisualizationModel {
  getNodes(maxNodes) {
    return this.dataModel.getSelectedDataset()
      .map((value) => ({
        color: this.dataModel.targets.length > 0 ? value?.[this.dataModel.targets[0]] : null,
        size: this.dataModel.targets.length > 1 ? value?.[this.dataModel.targets[1]] : null,
        features: JSON.stringify(value),
      }))
      .slice(0, maxNodes);
  }

  getLinks(distanceFn, maxNodes, maxLinks) {
    const links = [];
    const featureColumns = this.dataModel.getFeatureColumns();
    featureColumns
      .slice(0, maxNodes)
      .forEach(
        (distanceFrom, i) => {
          featureColumns
            .slice(i + 1, d3.min([maxLinks, featureColumns.length]))
            .forEach((distanceTo, j) => {
              const dist = distanceFn(Object.values(distanceFrom), Object.values(distanceTo));
              links.push(
                {
                  source: i,
                  target: j + i + 1,
                  value: dist,
                },
              );
            });
        },
      );
    return links;
  }

  getPreparedDataset({ distanceFn, maxNodes, maxLinks }) {
    return {
      nodes: this.getNodes(maxNodes),
      links: this.getLinks(distanceFn, maxNodes, maxLinks),
      selectedTarget: this.dataModel.getTargetColumns(),
    };
  }
}

export default ForceFieldModel;

VisualizationCollector.addVisualization({
  id: 'force',
  label: 'Force Field',
  model: new ForceFieldModel(),
  visualization: forceField,
  options: { distance: true },
});
