import * as d3 from 'd3';
import drawTargetLegend from './DrawTargetLegend';

function scatterPlotMatrix({
  data,
  features,
  targets,
  selectedTarget,
}) {
  const columns = Object.keys(data[0]).filter((value) => features.includes(value));
  const svg = d3.select('#area');
  let { width } = svg.node().getBoundingClientRect();
  const { height } = svg.node().getBoundingClientRect();
  width -= 150;
  const padding = 30;
  const size = (width - (columns.length + 1) * padding) / columns.length + padding;

  const x = columns.map((c) => d3.scaleLinear()
    .domain(d3.extent(data, (d) => d[c]))
    .rangeRound([padding / 2, size - padding / 2]));

  const y = x.map((value) => value.copy().range([size - padding / 2, padding / 2]));

  const startBrush = (cell, circle, svgGraph) => {
    let brushCell;

    const brush = d3.brush()
      .extent([[padding / 2, padding / 2], [size - padding / 2, size - padding / 2]]);
    brush
      .on('start', function brushstarted() {
        if (brushCell !== this) {
          d3.select(brushCell).call(brush.move, null);
          brushCell = this;
        }
      })
      .on('brush', ({ selection }, [i, j]) => {
        let selected = [];
        if (selection) {
          const [[x0, y0], [x1, y1]] = selection;
          circle.classed('hidden',
            (d) => x0 > x[i](d[columns[i]])
              || x1 < x[i](d[columns[i]])
              || y0 > y[j](d[columns[j]])
              || y1 < y[j](d[columns[j]]));
          selected = data.filter(
            (d) => x0 < x[i](d[columns[i]])
              && x1 > x[i](d[columns[i]])
              && y0 < y[j](d[columns[j]])
              && y1 > y[j](d[columns[j]]),
          );
        }
        svgGraph.property('value', selected).dispatch('input');
      })
      .on('end', ({ selection }) => {
        if (selection) return;
        svgGraph.property('value', []).dispatch('input');
        circle.classed('hidden', false);
      });

    cell.call(brush);
  };
  const symbol = d3.symbol();
  const shape = d3.scaleOrdinal(d3.symbols);

  const color = d3.scaleOrdinal()
    .domain(data.map((d) => d[targets[0]]))
    .range(d3.schemeCategory10);

  const xAxis = (() => {
    const axis = d3.axisBottom()
      .ticks(6)
      .tickSize(size * columns.length);
    return (g) => g.selectAll('g').data(x).join('g')
      .attr('transform', (d, i) => `translate(${i * size},0)`)
      .each(function (d) { return d3.select(this).call(axis.scale(d)); })
      // eslint-disable-next-line no-shadow
      .call((g) => g.select('.domain').remove())
      // eslint-disable-next-line no-shadow
      .call((g) => g.selectAll('.tick line').attr('stroke', '#ddd'));
  })();

  const yAxis = (() => {
    const axis = d3.axisLeft()
      .ticks(6)
      .tickSize(-size * columns.length);
    return (g) => g.selectAll('g').data(y).join('g')
      .attr('transform', (d, i) => `translate(0,${i * size})`)
      .each(function (d) { return d3.select(this).call(axis.scale(d)); })
      // eslint-disable-next-line no-shadow
      .call((g) => g.select('.domain').remove())
      // eslint-disable-next-line no-shadow
      .call((g) => g.selectAll('.tick line').attr('stroke', '#ddd'));
  })();

  svg
    .attr('viewBox', `${-padding} 0 ${width} ${width}`);

  svg.append('style')
    .text('circle.hidden { fill: #000; fill-opacity: 1; r: 1px; }');

  svg.append('g')
    .call(xAxis);

  svg.append('g')
    .call(yAxis);

  const cell = svg.append('g')
    .selectAll('g')
    .data(d3.cross(d3.range(columns.length), d3.range(columns.length)))
    .join('g')
    .attr('transform', ([i, j]) => `translate(${i * size},${j * size})`);

  cell.append('rect')
    .attr('fill', 'none')
    .attr('stroke', '#aaa')
    .attr('x', padding / 2 + 0.5)
    .attr('y', padding / 2 + 0.5)
    .attr('width', size - padding)
    .attr('height', size - padding);

  cell.each(function ([i, j]) {
    d3.select(this).selectAll('path')
      .data(data.filter((d) => !Number.isNaN(d[columns[i]]) && !Number.isNaN(d[columns[j]])))
      .join('path')
      .attr('transform', (d) => `translate(${x[i](d[columns[i]])},${y[j](d[columns[j]])})`);
  });

  const circle = cell.selectAll('path')
    .attr('d', symbol.type((d) => shape(d[targets[1]])))
    .attr('fill', (d) => color(d[targets[0]]));

  cell.call(startBrush, circle, svg);

  svg.append('g')
    .style('font', 'bold 10px sans-serif')
    .selectAll('text')
    .data(columns)
    .join('text')
    .attr('transform', (d, i) => `translate(${i * size},${i * size})`)
    .attr('x', padding)
    .attr('y', padding)
    .attr('dy', '.71em')
    .text((d) => d);

  svg.property('value', []);
  drawTargetLegend(color, selectedTarget, width, 0 + 15, height, 25);
}

export default scatterPlotMatrix;
