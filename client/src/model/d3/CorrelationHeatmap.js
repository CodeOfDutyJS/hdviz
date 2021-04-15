import * as d3 from 'd3';
import drawColorScale from './DrawColorScale';

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

function correlationMap(cluster) {
  const leaves = getLeaves(cluster);
  const colnames = [];
  leaves.forEach((leaf) => colnames.push(leaf.id));
  const toGrid = [];
  let row = 1;
  leaves.forEach((leaf) => {
    let col = 1;
    colnames.forEach((name) => {
      const obj = {};
      obj.row = row;
      obj.col = col;
      obj.column_x = leaf.id;
      obj.column_y = name;
      obj.correlation = leaf[name];
      toGrid.push(obj);
      col += 1;
    });
    row += 1;
  });
  return toGrid;
}

function correlationHeatmap({ cluster }) {
  const cols = [];
  getLeaves(cluster)
    .forEach((leaf) => cols.push(leaf.id));
  const grid = correlationMap(cluster);
  const rows = d3.max(grid, (d) => d.row);
  const margin = {
    top: 20,
    bottom: 150,
    left: 30,
    right: 400,
  };
  const svg = d3.select('#area');
  let { width, height } = svg.node().getBoundingClientRect();
  width -= margin.right;
  height -= margin.top;
  height -= margin.bottom;
  // const { width, height } = { width: 600, height: 600 };
  // svg.attr('viewBox', '0 0 600 600').attr('preserveAspectRatio', 'xMinYMin');
  // const { height } = svg.node().getBoundingClientRect();

  const colorRange = ['#b50e0e', 'white', '#053061'];
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
    .range(colorRange)
    .domain([1, 0, -1]);

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

  drawColorScale(c, [-1, 0, 1], width + 150, 100, 100, 25, 'Pearson Coefficent');

  const aspect = width / height;
  const chart = d3.select('#area');
  d3.select(window)
    .on('resize', () => {
      d3.select('#area').selectAll('*').remove();
      correlationHeatmap({ cluster });
    });
}

export default correlationHeatmap;
