import * as d3 from 'd3';

function drawShapeLegend(shape, target, x, y, height, width, column = 1) {
  const symbol = d3.symbol();
  const svg = d3.select('#area');
  const shapeTitle = Object.keys(target[0])[column];
  let shapeValues = {};
  const valueArray = target.map((value) => value[shapeTitle]);
  valueArray.forEach((value) => {
    if (!(value in shapeValues)) {
      shapeValues[value] = 1;
    }
  });
  shapeValues = Object.keys(shapeValues);

  const yScale = d3.scaleBand()
    .range([y, y + height])
    .paddingInner(0.5)
    .domain(d3.range(0, shapeValues.length));

  svg.append('g')
    .attr('class', 'legendShape')
    .selectAll('path')
    .data(shapeValues)
    .enter()
    .append('path')
    .attr('d', symbol.type((d) => shape(d)))
    .attr('fill', 'gray')
    .attr('transform', (d, i) => `translate( ${x}, ${yScale(i)})`);

  svg.append('g')
    .attr('class', 'legendShape')
    .selectAll('text')
    .data(shapeValues)
    .enter()
    .append('text')
    .text((d) => d)
    .attr('x', x + width + 10)
    .attr('y', (d, i) => yScale(i) + 5);
}

export default drawShapeLegend;
