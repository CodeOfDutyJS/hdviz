/* eslint-disable no-param-reassign */
import * as d3 from 'd3';

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

  const colore = d3.scaleOrdinal(d3.schemeCategory10);

  const { links, nodes } = data;

  const svg = d3.select('#area');

  const { width } = svg.node().getBoundingClientRect();
  const { height } = svg.node().getBoundingClientRect();

  const simulation = d3.forceSimulation(nodes)
    .force('link', d3.forceLink(links).distance((d) => d.value * 1).strength((d) => (1 / (d.value * 1))).id((d) => d.id))
    .force('charge', d3.forceManyBody())
    .force('center', d3.forceCenter(width / 2, height / 2));

  const node = svg.append('g')
    .attr('stroke', '#fff')
    .attr('stroke-width', 1.5)
    .selectAll('circle')
    .data(nodes)
    .join('circle')
    .attr('r', 5)
    .attr('fill', (d) => colore(d.colore))
    .call(drag(simulation));

  node.append('title')
    .text((d) => d.features);

  simulation.on('tick', () => {
    node
      .attr('cx', (d) => d.x)
      .attr('cy', (d) => d.y);
  });
}

export default forceField;
