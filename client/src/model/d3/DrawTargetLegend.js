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

  const yScale = d3.scaleBand()
    .range([y, y + height])
    .paddingInner(0.5)
    .domain(d3.range(0, colorValues.length));

  const bandwidth = yScale.bandwidth() > 50 ? 50 : yScale.bandwidth();

  svg.append('g')
    .selectAll('rect')
    .data(colorValues)
    .enter()
    .append('rect')
    .attr('x', x)
    .attr('y', (d, i) => yScale(i))
    .attr('width', width)
    .attr('height', bandwidth)
    .style('fill', (d, i) => color(d))
    .style('opacity', 1);

  svg.append('g')
    .selectAll('text')
    .data(colorValues)
    .enter()
    .append('text')
    .text((d) => d)
    .attr('x', x + width + 10)
    .attr('y', (d, i) => yScale(i) + (bandwidth / 2));
}

export default drawTargetLegend;
