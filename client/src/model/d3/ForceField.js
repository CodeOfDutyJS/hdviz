/* eslint-disable no-param-reassign */
import * as d3 from 'd3';
import drawTargetLegend from './DrawTargetLegend';

function forceField(data) {
  const drag = (simulation) => {
    function dragstarted(event) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return d3.drag()
      .on('start', dragstarted)
      .on('drag', dragged)
      .on('end', dragended);
  };

  const svg = d3.select('#area');
  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const { links, nodes } = data;

  let { width } = svg.node().getBoundingClientRect();

  const { height } = svg.node().getBoundingClientRect();

  const scaleLinks = d3.scaleLinear()
    .domain(d3.extent(links, (d) => (d.value)))
    .range([16, Math.min(width - 150, 600)]);

  links.forEach(
    (d) => {
      d.value = scaleLinks(d.value);
    },
  );

  // const { height } = svg.node().getBoundingClientRect();

  width -= 300;
  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links)
      .distance((d) => d.value)
      .strength((d) => 1 / d.value))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));

  const node = svg.append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', 5)
    .attr('fill', (d) => color(d.color))
    .call(drag(simulation));

  node.append('title')
    .text((d) => d.features);

  simulation.on('tick', () => {
    node
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
  });

  drawTargetLegend(color, data.selectedTarget, width + 50, 0, height - 100, 25);

  d3.select(window)
    .on('resize', () => {
      d3.select('#area').selectAll('*').remove();
      forceField(data);
    });
}

export default forceField;
