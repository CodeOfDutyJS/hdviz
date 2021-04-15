import * as d3 from 'd3';

function clearVisualization() {
  d3.select(window)
    .on('resize', null);
  const svg = d3.select('#area');
  svg.selectAll('*').remove();
}

export default clearVisualization;
