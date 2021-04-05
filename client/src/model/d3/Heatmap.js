import * as d3 from 'd3';
import HeatMapModel from '../HeatMapModel';

function heatmap(cluster, clusterCols) {
  const cols = clusterCols;
  const grid = HeatMapModel.dataGrid(cluster, cols);
  const rows = d3.max(grid, (d) => d.row);
  const width = 600;
  const height = 600;
  const margin = {
    top: 20,
    bottom: 20,
    left: 100,
    right: 20,
  };
  const svg = d3.select('#area');
  const padding = 0.0;
  const x = d3.scaleBand()
    .range([margin.left, width + margin.left])
    .paddingInner(padding)
    .domain(d3.range(1, cols.length + 1));
  const y = d3.scaleBand()
    .range([margin.top, height + margin.top])
    .paddingInner(padding)
    .domain(d3.range(1, rows + 1));

  const c = d3.scaleLinear()
    .range(['white', '#ff1a00'])
    .domain([-3, 3]);

  const xAxis = d3.axisBottom(x).tickFormat((d, i) => cols[i]);
  const yAxis = d3.axisRight(y).tickFormat([]).tickSize(0);

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0, ${height + margin.top})`)
    .call(xAxis);

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
    .style('fill', (d) => c(d.value))
    .style('opacity', 1e-5)
    .transition()
    .style('opacity', 1);
}

export default heatmap;
