import * as d3 from 'd3';

function hideLegend(x, y, width, height) {
  const svg = d3.select('#area');

  d3.selectAll('.legend')
    .attr('opacity', '1');
  d3.selectAll('.legendShape')
    .attr('opacity', '0');

  svg.append('rect')
    .attr('class', 'legendButton')
    .attr('fill', 'lightgray')
    .attr('stroke', 'black')
    .attr('width', '160')
    .attr('height', '25')
    .attr('x', x)
    .attr('y', y)
    .on('mouseover', () => {
      d3.selectAll('.legend')
        .attr('opacity', '0');
      d3.selectAll('.legendShape')
        .attr('opacity', '1');
      d3.selectAll('.legendButton')
        .attr('fill', 'gray');
    })
    .on('mouseout', () => {
      d3.selectAll('.legend')
        .attr('opacity', '1');
      d3.selectAll('.legendShape')
        .attr('opacity', '0');
      d3.selectAll('.legendButton')
        .attr('fill', 'lightgray');
    });

  svg.append('text')
    .attr('x', x + 10)
    .attr('y', y + 12.5)
    .text('hover to switch legend');
}

export default hideLegend;
