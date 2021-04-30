import * as d3 from 'd3';

function parallelCoordinates({
  data,
  features,
  targets,
}) {
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  let svg = d3.select('#area');
  const margin = {
    top: 30,
    right: 10,
    bottom: 10,
    left: 0,
  };
  const width = svg.node().getBoundingClientRect().width - margin.left - margin.right;
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
      .domain(d3.extent(data, (d) => +d[element]))
      .range([height, 0]);
  });

  const x = d3.scalePoint()
    .range([0, width])
    .padding(1)
    .domain(features);

  svg
    .selectAll('myPath')
    .data(data)
    .join('path')
    .attr(
      'd',
      (d) => d3.line()(features.map((p) => [x(p), y[p](d[p])])),
    )
    .attr('class', (d) => `line ${d[targets[0]]}`)
    .style('fill', 'none')
    .style('stroke', (d) => color(d[targets[0]]))
    .style('opacity', 0.5);

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
}

export default parallelCoordinates;
