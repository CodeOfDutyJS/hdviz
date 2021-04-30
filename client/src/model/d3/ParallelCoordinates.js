import * as d3 from 'd3';
import drawTargetLegend from './DrawTargetLegend';

function parallelCoordinates(data) {
  const props = {
    color: d3.scaleOrdinal(d3.schemeCategory10),
    svg: d3.select('#area'),
    ...data,
  };
  const {
    color,
    selectedData,
    features,
    targets,
    selectedTarget,
  } = props;

  let { svg } = props;
  const margin = {
    top: 30,
    right: 10,
    bottom: 10,
    left: 0,
  };
  const width = svg.node().getBoundingClientRect().width - margin.left - margin.right - 150;
  const height = svg.node().getBoundingClientRect().height - margin.top - margin.bottom;

  svg = svg
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr(
      'transform',
      `translate(${margin.left}, ${margin.top})`,
    );

  const y = {};
  features.forEach((element) => {
    y[element] = d3.scaleLinear()
      .domain(d3.extent(selectedData, (d) => +d[element]))
      .range([height, 0]);
  });

  const x = d3.scalePoint()
    .range([0, width])
    .padding(1)
    .domain(features);

  const highlight = (event, d) => {
    d3.selectAll('.line')
      .transition().duration(150)
      .style('stroke', 'lightgrey')
      .style('opacity', '0.2');
    d3.selectAll(`.${d[targets[0]]}`)
      .transition().duration(200)
      .style('stroke', color(d[targets[0]]))
      .style('opacity', '1');
  };

  const doNotHighlight = () => {
    d3.selectAll('.line')
      .transition().duration(150).delay(600)
      .style('stroke', (val) => (color(val[targets[0]])))
      .style('opacity', '1');
  };

  svg
    .selectAll('myPath')
    .data(selectedData)
    .join('path')
    .attr(
      'd',
      (d) => d3.line()(features.map((p) => [x(p), y[p](d[p])])),
    )
    .attr('class', (d) => `line ${d[targets[0]]}`)
    .style('fill', 'none')
    .style('stroke', (d) => color(d[targets[0]]))
    .style('opacity', 0.5)
    .on('mouseover', highlight)
    .on('mouseleave', doNotHighlight);

  svg.selectAll('myAxis')
    .data(features)
    .join('g')
    .attr('transform', (d) => `translate(${x(d)})`)
    .each(function (d) { d3.select(this).call(d3.axisLeft().scale(y[d])); })
    .append('text')
    .style('text-anchor', 'middle')
    .attr('y', -9)
    .text((d) => d)
    .style('fill', 'black');

  drawTargetLegend(color, selectedTarget, width, 0 + 15, height, 25);
}

export default parallelCoordinates;
