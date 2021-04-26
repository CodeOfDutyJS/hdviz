import * as d3 from 'd3';
import drawTargetLegend from './DrawTargetLegend';

function linearProjection(data) {
  const svg = d3.select('#area');

  let { width } = svg.node().getBoundingClientRect();
  const { height } = svg.node().getBoundingClientRect();

  width -= 300;

  const minX = data.rangeX[0] * 2;
  const maxX = data.rangeX[1] * 2;
  const minY = data.rangeY[0] * 2;
  const maxY = data.rangeY[1] * 2;

  const x = d3.scaleLinear([minX, maxX], [0, width]).nice();
  const y = d3.scaleLinear([minY, maxY], [0, height]).nice();

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
    .attr('cx', (d) => x(d.x))
    .attr('cy', (d) => y(d.y))
    .style('fill', (d) => color(d.color));

  // line
  svg.append('g')
    .attr('stroke', '#000')
    .selectAll('line')
    .data(data.axis)
    .join('line')
    .attr('x1', () => x(data.mean.meanx))
    .attr('y1', () => y(data.mean.meany))
    .attr('x2', (d) => x(3 * d.x))
    .attr('y2', (d) => y(3 * d.y))
    .attr('marker-end', 'url(#arrow)');

  // label
  svg.append('g').selectAll('text')
    .data(data.axis)
    .join('text')
    .attr('x', (d) => x(3 * d.x))
    .attr('y', (d) => y(3 * d.y))
    .style('font', '11px times')
    .text((d) => d.label);

  drawTargetLegend(color, data.selectedTarget, width + 50, 0, height, 25);
  d3.select(window)
    .on('resize', () => {
      d3.select('#area').selectAll('*').remove();
      linearProjection(data);
    });
}

export default linearProjection;
