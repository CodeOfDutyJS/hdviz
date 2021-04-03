import * as d3 from 'd3';
import HeatMapModel from '../HeatMapModel';

function drawTargetRows(cluster, cols) {
  const grid = HeatMapModel.dataGrid(cluster, cols);
  const rows = d3.max(grid, (d) => d.row);
  const svg = d3.select('#area');
  console.log(grid);
  const color = d3.scaleOrdinal()
    .range(d3.schemeCategory10);

  const margin = {
    top: 20,
    bottom: 20,
    left: 100,
    right: 20,
  };

  const width = 25 * cols.length || svg.node().getBoundingClientRect().width;
  const height = 600 || svg.node().getBoundingClientRect().height;

  const y = d3.scaleBand()
    .range([margin.top, height + margin.top])
    .paddingInner(0)
    .domain(d3.range(1, rows + 1));

  const x = d3.scaleBand()
    .range([700, 700 + 25 * cols.length])
    .paddingInner(0)
    .domain(d3.range(1, cols.length + 1));

  const yAxis = d3.axisRight(y).tickFormat([]).tickSize(0);
  const xAxis = d3.axisBottom(x).tickFormat((d, i) => cols[i]).tickSize(10);

  svg.append('g')
    .attr('class', 'y axis2')
    .attr('transform', `translate(${width + margin.left + 600}, 0)`)
    .call(yAxis);

  svg.append('g')
    .attr('class', 'x axis2')
    .attr('transform', `translate(750, ${height + margin.top})`)
    .call(xAxis);

  svg.append('g')
    .selectAll('rect')
    .data(grid)
    .enter()
    .append('rect')
    .attr('x', (d) => x(d.col))
    .attr('y', (d) => y(d.row))
    .attr('width', 25)
    .attr('height', y.bandwidth())
    .style('fill', (d) => color(d.value))
    .style('opacity', 1e-5)
    .transition()
    .style('opacity', 1);
}

export default drawTargetRows;
