import * as d3 from 'd3';

function hideLegend(x, y, width, height) {
  const svg = d3.select('#area');

  d3.selectAll('.legend')
    .attr('opacity', '1');
  d3.selectAll('.legendShape')
    .attr('opacity', '0');

  svg.append('rect')
    .attr('fill', 'gray')
    .attr('stroke', 'black')
    .attr('width', '50')
    .attr('height', '50')
    .attr('x', x)
    .attr('y', y)
    .on('mouseover', () => {
      d3.selectAll('.legend')
        .attr('opacity', '0');
      d3.selectAll('.legendShape')
        .attr('opacity', '1');
    })
    .on('mouseout', () => {
      d3.selectAll('.legend')
        .attr('opacity', '1');
      d3.selectAll('.legendShape')
        .attr('opacity', '0');
    });
}

export default hideLegend;
