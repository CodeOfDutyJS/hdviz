import * as d3 from 'd3';

function drawShapeLegend(shape, target, x, y, height, width, column = 1) {
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
    .selectAll('path')
    .data(shapeValues)
    .join('path')
    .attr('d', (d) => shape(d))
    .attr('transform', (d, i) => `translate( 0, ${yScale(i)})`);
}

export default drawShapeLegend;
