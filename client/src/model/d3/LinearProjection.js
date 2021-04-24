import * as d3 from 'd3';

function linearProjection(data) {
  const svg = d3.select('#area');

  const { width } = svg.node().getBoundingClientRect();
  const { height } = svg.node().getBoundingClientRect();

  const minX = data.points_rangeX[0];
  const maxX = data.points_rangeX[1];
  const minY = data.points_rangeY[0];
  const maxY = data.points_rangeY[1];
  const axisMinX = data.axis_rangeX[0];
  const axisMaxX = data.axis_rangeX[1];
  const axisMinY = data.axis_rangeY[0];
  const axisMaxY = data.axis_rangeY[1];

  const pointsX = d3.scaleLinear([minX, maxX], [150, width - 150]).clamp(true);
  const pointsY = d3.scaleLinear([minY, maxY], [150, height - 150]).clamp(true);

  const ratio = Math.min(Math.abs(minX / axisMinX), Math.abs(maxX / axisMaxX), Math.abs(minY / axisMinY), Math.abs(maxY / axisMaxY));

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  // marker
  svg.append('defs')
    .append('marker')
    .attr('id', 'arrow')
    .attr('viewBox', [0, 0, 20, 20])
    .attr('refX', 5)
    .attr('refY', 5)
    .attr('markerWidth', 8)
    .attr('markerHeight', 8)
    .attr('orient', 'auto-start-reverse')
    .append('path')
    .attr('d', d3.line()([[0, 0], [0, 8], [8, 5]]))
    .attr('stroke', 'black');

  // point
  svg.append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(data.points)
    .join('circle')
    .attr('r', 5)
    .attr('cx', (d) => pointsX(d.x))
    .attr('cy', (d) => pointsY(d.y))
    .style('fill', (d) => color(d.color));

  // line
  svg.append('g')
    .attr('stroke', '#000')
    .selectAll('line')
    .data(data.axis)
    .join('line')
    .attr('x1', () => pointsX(0))
    .attr('y1', () => pointsY(0))
    .attr('x2', (d) => pointsX(d.x * ratio))
    .attr('y2', (d) => pointsY(d.y * ratio))
    .attr('marker-end', 'url(#arrow)');

  // label
  svg.append('g').selectAll('text')
    .data(data.axis)
    .join('text')
    .attr('x', (d) => pointsX(d.x * ratio) + 5)
    .attr('y', (d) => pointsY(d.y * ratio) - 5)
    .attr('font-weight', 600)
    .text((d, i) => i + 1);
}

export default linearProjection;
