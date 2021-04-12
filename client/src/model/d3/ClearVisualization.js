import * as d3 from 'd3';

function clearVisualization() {
  const svg = d3.select('#area');
  svg.selectAll('*').remove();
}

export default clearVisualization;
