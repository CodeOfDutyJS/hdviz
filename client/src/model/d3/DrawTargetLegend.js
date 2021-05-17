import * as d3 from 'd3';

function drawTargetLegend(color, target, x, y, height, width, column = 0) {
  const svg = d3.select('#area');
  const colorTitle = Object.keys(target[0])[column];
  let colorValues = {};
  const valueArray = target.map((value) => value[colorTitle]);
  valueArray.forEach((value) => {
    if (!(value in colorValues)) {
      colorValues[value] = 1;
    }
  });
  colorValues = Object.keys(colorValues);

  // eslint-disable-next-line no-param-reassign
  height = colorValues.length < 8 ? colorValues.length * 30 : height;

  const yScale = d3.scaleBand()
    .range([y, y + height])
    .paddingInner(0.5)
    .domain(d3.range(0, colorValues.length));

  const bandwidth = yScale.bandwidth() > 50 ? 50 : yScale.bandwidth();

  const radius = colorValues.length < 8 ? 15 : 5;
  svg.append('g')
    .attr('class', 'legend')
    .selectAll('circle')
    .data(colorValues)
    .enter()
    .append('circle')
    .attr('cx', x)
    .attr('cy', (d, i) => yScale(i))
    .attr('r', radius)
    .style('fill', (d, i) => color(d))
    .style('opacity', 1);

  svg.append('g')
    .attr('class', 'legend')
    .selectAll('text')
    .data(colorValues)
    .enter()
    .append('text')
    .text((d) => d)
    .attr('x', x + width + 10)
    .attr('y', (d, i) => yScale(i))
    .attr('fill', (d) => color(d));
}

export default drawTargetLegend;
