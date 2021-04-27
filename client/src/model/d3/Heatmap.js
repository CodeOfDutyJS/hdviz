import * as d3 from 'd3';
import drawColorScale from './DrawColorScale';
import drawTargetLegend from './DrawTargetLegend';

function getLeaves(cluster) {
  let leaves = [];
  if (!cluster.children) {
    leaves.push(cluster);
    return leaves;
  }
  cluster.children.forEach((value) => {
    leaves = leaves.concat(getLeaves(value));
  });
  return leaves;
}

function dataGrid(cluster, cols) {
  const leaves = getLeaves(cluster);
  const colnames = cols;
  const toGrid = [];
  let row = 1;
  leaves.forEach((leaf) => {
    let col = 1;
    colnames.forEach((name) => {
      const obj = {};
      obj.row = row;
      obj.col = col;
      // obj.column_x = leaf.id; optional ? on larger datasets cant even read row names
      obj.column_y = name;
      obj.value = leaf[name];
      toGrid.push(obj);
      col += 1;
    });
    row += 1;
  });
  return toGrid;
}

function drawTargetRows(cluster, cols, margin, selectedTarget) {
  const grid = dataGrid(cluster, cols);
  const rows = d3.max(grid, (d) => d.row);
  const svg = d3.select('#area');
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  let { width, height } = svg.node().getBoundingClientRect();
  width -= margin.right;
  height -= margin.top;
  height -= margin.bottom;

  const y = d3.scaleBand()
    .range([margin.top, height + margin.top])
    .paddingInner(0)
    .domain(d3.range(1, rows + 1));

  const x = d3.scaleBand()
    .range([width + margin.left, width + margin.left + 25 * cols.length])
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
    .attr('transform', `translate(0, ${height + margin.top})`)
    .call(xAxis)
    .selectAll('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '.15em')
    .attr('transform', 'rotate(-65)');

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

  drawTargetLegend(color, selectedTarget, width + (cols.length * 25) + 50, 120, height - 120, 25);
  if (Object.keys(selectedTarget[0]).length === 2) drawTargetLegend(color, selectedTarget, width + (cols.length * 25) + 125, 120, height - 120, 25, 1);
}

function heatmap({
  cluster,
  clusterCols,
  targetCols,
  selectedTarget,
  color,
}) {
  const svg = d3.select('#area');
  const cols = getLeaves(clusterCols).map((value) => value.id);
  const colorRange = color;
  const grid = dataGrid(cluster, cols);
  const rows = d3.max(grid, (d) => d.row);
  const margin = {
    top: 20,
    bottom: 150,
    left: 30,
    right: 400,
  };

  let { width, height } = svg.node().getBoundingClientRect();
  width -= margin.right;
  height -= margin.top;
  height -= margin.bottom;
  const padding = 0.0;
  const x = d3.scaleBand()
    .range([margin.left, width + margin.left])
    .paddingInner(padding)
    .domain(d3.range(1, cols.length + 1));
  const y = d3.scaleBand()
    .range([margin.top, height + margin.top])
    .paddingInner(padding)
    .domain(d3.range(1, rows + 1));

  const min = d3.min(grid, (d) => d.value);
  const max = d3.max(grid, (d) => d.value);

  const range = [min, (min + max) / 2, max];
  const c = d3.scaleLinear()
    .range(colorRange)
    .domain(range);

  const xAxis = d3.axisBottom(x).tickFormat((d, i) => cols[i]);
  const yAxis = d3.axisRight(y).tickFormat([]).tickSize(0);

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
    .style('fill', (d) => c(d.value))
    .style('opacity', 1e-5)
    .transition()
    .style('opacity', 1);

  drawTargetRows(cluster, targetCols, margin, selectedTarget);
  drawColorScale(c, range, width + (targetCols.length * 25) + 50, 30, 100, 25, 'Cell value');

  d3.select(window)
    .on('resize', () => {
      d3.select('#area').selectAll('*').remove();
      heatmap({
        cluster,
        clusterCols,
        targetCols,
        selectedTarget,
        color,
      });
    });
}

export default heatmap;
