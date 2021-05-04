import * as d3 from 'd3';

function umap(data) {
  const svg = d3.select('#area');

  const { width } = svg.node().getBoundingClientRect();
  const { height } = svg.node().getBoundingClientRect();

  const minX = data.points_rangeX[0];
  const maxX = data.points_rangeX[1];
  const minY = data.points_rangeY[0];
  const maxY = data.points_rangeY[1];

  const pointsX = d3.scaleLinear([minX, maxX], [150, width - 150]).clamp(true);
  const pointsY = d3.scaleLinear([minY, maxY], [150, height - 150]).clamp(true);

  const color = d3.scaleOrdinal(d3.schemeCategory10);
  const shape = d3.scaleOrdinal(d3.symbols);

  const symbol = d3.symbol();

  // point
  svg.append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('path')
    .data(data.points)
    .join('path')
    .attr('d', symbol.type((d) => shape(d.shape)))
    .attr('transform', (d) => `translate(${pointsX(d.x)},${pointsY(d.y)})`)
    .style('fill', (d) => color(d.color));
}

export default umap;
