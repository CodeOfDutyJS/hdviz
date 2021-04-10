import * as d3 from 'd3';

function DrawColorScale(colorRange, x, y, width, height) {
  const xScale = d3.scaleLinear()
    .domain(colorRange)
    .range(0, width);

  const yScale = d3.scaleBand()
    .domain([0, 1])
    .range(0, height);

}
