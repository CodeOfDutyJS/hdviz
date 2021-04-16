import * as d3 from 'd3';

function drawColorScale(color, range, x, y, width, height, name) {
  const svg = d3.select('#area');
  const padding = 0.0;
  const values = d3.range(d3.min(range), d3.max(range), ((d3.max(range) - d3.min(range)) / 500).toPrecision(4));
  values[499] = d3.max(range);
  const xScale = d3.scaleBand()
    .range([x, x + width])
    .paddingInner(0)
    .domain(values);

  const xAxis = d3.axisBottom(xScale)
    .tickValues([values[0], values[125], values[250], values[375], values[499]]);

  svg.append('g')
    .attr('class', 'x axis3')
    .attr('transform', `translate(0, ${y + height})`)
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-65)');

  svg.append('text')
    .attr('transform', `translate(${x + (width / 2)}, ${y - 10})`)
    .style('text-anchor', 'middle')
    .text(name);

  svg.append('g')
    .selectAll('rect')
    .data(values)
    .enter()
    .append('rect')
    .attr('x', (d) => xScale(d))
    .attr('y', y)
    .attr('width', xScale.bandwidth())
    .attr('height', height)
    .style('fill', (d) => color(d * 1.25));
}

export default drawColorScale;
