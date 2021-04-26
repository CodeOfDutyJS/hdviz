import * as d3 from 'd3';
import { _3d } from 'd3-3d';

function processData({
  data,
  svg,
  width,
  height,
}) {
  const minX = d3.min(data.points, (d) => d.projected.x);
  const maxX = d3.max(data.points, (d) => d.projected.x);
  const minY = d3.min(data.points, (d) => d.projected.y);
  const maxY = d3.max(data.points, (d) => d.projected.y);
  const axisMinX = d3.min(data.axis, (d) => d[1].projected.x);
  const axisMaxX = d3.max(data.axis, (d) => d[1].projected.x);
  const axisMinY = d3.min(data.axis, (d) => d[1].projected.y);
  const axisMaxY = d3.max(data.axis, (d) => d[1].projected.y);
  const color = d3.scaleOrdinal(d3.schemeCategory10);
  // points
  const pointsX = d3.scaleLinear()
    .domain([minX, maxX])
    .range([1, 500]);
  const pointsY = d3.scaleLinear()
    .domain([minY, maxY])
    .range([1, 500]);
  const ratio = Math.min(
    Math.abs(minX / axisMinX),
    Math.abs(maxX / axisMaxX),
    Math.abs(minY / axisMinY),
    Math.abs(maxY / axisMaxY),
  );

  svg
    .selectAll('circle')
    .data(data.points)
    .attr('class', '_3d points')
    .join('circle')
    .attr('r', 5)
    .attr('stroke', '#fff')
    .attr('stroke-width', '1.5')
    .attr('cx', (d) => pointsX(d.projected.x))
    .attr('cy', (d) => pointsY(d.projected.y))
    .attr('fill', (d) => color(d.color));

  svg.selectAll('line')
    .data(data.axis)
    .join('line')
    .attr('stroke', '#000')
    .attr('class', '_3d lines')
    .attr('x1', (d) => pointsX(d[0].projected.x))
    .attr('y1', (d) => pointsY(d[0].projected.y))
    .attr('x2', (d) => pointsX(d[1].projected.x))
    .attr('y2', (d) => pointsY(d[1].projected.y));

  // label
  svg.selectAll('text')
    .data(data.axis)
    .join('text')
    .each((d) => {
      // eslint-disable-next-line no-param-reassign
      d[1].centroid = { x: d[1].rotated.x, y: d[1].rotated.y, z: d[1].rotated.z };
    })
    .attr('class', '_3d text')
    .attr('x', (d) => pointsX(d[1].projected.x) + 5)
    .attr('y', (d) => pointsY(d[1].projected.y) + 5)
    .attr('font-weight', 600)
    .text((d, i) => data.label[i]);

  d3.selectAll('._3d').sort(_3d().sort);
}

function drag(props) {
  /* eslint-disable no-param-reassign */
  const {
    point3d,
    line3d,
    startAngle,
    data,
  } = props;

  let mx = 0;
  let my = 0;
  let mouseX = 0;
  let mouseY = 0;
  function dragStart(event) {
    mx = event.x;
    my = event.y;
  }

  function dragged(event) {
    mouseX = mouseX || 0;
    mouseY = mouseY || 0;
    // eslint-disable-next-line no-mixed-operators
    const beta = (event.x - mx + mouseX) * Math.PI / 230;
    // eslint-disable-next-line no-mixed-operators
    const alpha = (event.y - my + mouseY) * Math.PI / 230 * (-1);
    data.points = point3d
      .rotateY(beta + startAngle)
      .rotateX(alpha - startAngle)(data.points);
    data.axis = line3d
      .rotateY(beta + startAngle)
      .rotateX(alpha - startAngle)(data.axis);
    processData(props);
  }

  function dragEnd(event) {
    mouseX = event.x - mx + mouseX;
    mouseY = event.y - my + mouseY;
  }

  return d3.drag()
    .on('start', dragStart)
    .on('drag', dragged)
    .on('end', dragEnd);
}

function linearProjection(data) {
  const props = {
    origin: [480, 300],
    startAngle: Math.PI / 4,
    scale: 50,
    get point3d() {
      const point3d = _3d()
        .x((d) => d.x)
        .y((d) => d.y)
        .z((d) => d.z)
        .origin(this.origin)
        .rotateY(this.startAngle)
        .rotateX(-this.startAngle);
      return point3d;
    },
    get line3d() {
      const line3d = _3d()
        .x((d) => d.x)
        .y((d) => d.y)
        .z((d) => d.z)
        .shape('LINE')
        .origin(this.origin)
        .rotateY(this.startAngle)
        .rotateX(-this.startAngle);
      return line3d;
    },
    data,
    svg: d3.select('#area'),
    get width() { return this.svg.node().getBoundingClientRect().width; },
    get height() { return this.svg.node().getBoundingClientRect().height; },
  };

  props.data.points = props.point3d(props.data.points);
  props.data.axis = props.line3d(props.data.axis);

  props.svg = props.svg
    .call(drag(props))
    .append('g');

  processData(props);
}

export default linearProjection;
