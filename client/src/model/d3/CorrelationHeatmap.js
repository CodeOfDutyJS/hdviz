import * as d3 from 'd3';
import HeatMapModel from '../HeatMapModel';

function correlationHeatmap(cluster) {
  const cols = [];
  HeatMapModel.getLeaves(cluster)
    .forEach((leaf) => cols.push(leaf.id));
  const grid = HeatMapModel.correlationMap(cluster);
  const rows = d3.max(grid, (d) => d.row);
  const margin = {
    top: 0,
    bottom: 100,
    left: 20,
    right: 100,
  };
  const svg = d3.select('#area');
  const { width, height } = svg.node().getBoundingClientRect();
  // const { width, height } = { width: 600, height: 600 };
  // svg.attr('viewBox', '0 0 600 600').attr('preserveAspectRatio', 'xMinYMin');
  // const { height } = svg.node().getBoundingClientRect();

  console.log(width, height);
  const padding = 0.1;
  const x = d3.scaleBand()
    .range([margin.left, width + margin.left])
    .paddingInner(padding)
    .domain(d3.range(1, rows + 1));
  const y = d3.scaleBand()
    .range([margin.top, height + margin.top])
    .paddingInner(padding)
    .domain(d3.range(1, rows + 1));

  const c = d3.scaleLinear()
    .range(['#b50e0e', 'white', '#053061'])
    .domain([-1, 0, 1]);

  const xAxis = d3.axisBottom(x).tickFormat((d, i) => cols[i]);
  const yAxis = d3.axisRight(y).tickFormat((d, i) => cols[i]);

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${height + margin.top})`)
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-65)');

  svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', `translate(${width + margin.left}, 0)`)
    .call(yAxis);

  svg.selectAll('rect')
    .data(grid, (d) => d.column_a + d.column_b)
    .enter().append('rect')
    .attr('x', (d) => x(d.col))
    .attr('y', (d) => y(d.row))
    .attr('width', x.bandwidth())
    .attr('height', y.bandwidth())
    .style('fill', (d) => c(d.correlation))
    .style('opacity', 1e-5)
    .transition()
    .style('opacity', 1);

  const aspect = width / height;
  const chart = d3.select('#area');
  d3.select(window)
    .on('resize', () => {
      d3.select('#area').selectAll('*').remove();
      correlationHeatmap(cluster);
    });
}

export default correlationHeatmap;
