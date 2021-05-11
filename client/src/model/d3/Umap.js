import * as d3 from 'd3';
import { _3d } from 'd3-3d';

function processData({
  data,
  svg,
  width,
  height,
  color,
  shape,
}) {
  const minX = d3.min(data.points, (d) => d.projected.x);
  const maxX = d3.max(data.points, (d) => d.projected.x);
  const minY = d3.min(data.points, (d) => d.projected.y);
  const maxY = d3.max(data.points, (d) => d.projected.y);

  const pointsX = d3.scaleLinear([minX, maxX], [150, width - 150]).clamp(true);
  const pointsY = d3.scaleLinear([minY, maxY], [150, height - 150]).clamp(true);

  const symbol = d3.symbol();

  svg
    .selectAll('title')
    .remove();
  svg
    .selectAll('path')
    .data(data.points)
    .join('path')
    .attr('class', '_3d points')
    .attr('d', symbol.type((d) => shape(d.shape)))
    .attr('transform', (d) => `translate(${pointsX(d.projected.x)},${pointsY(d.projected.y)})`)
    .style('fill', (d) => color(d.color))
    .append('svg:title')
    .text((d) => {
      let description = '';
      Object.keys(d.description).forEach((key) => {
        description += `${key}: ${d.description[key]};\n`;
      });
      return description;
    });

  d3.selectAll('._3d').sort(_3d().sort);
}

function drag(props) {
  const {
    point3d,
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

function umap(data) {
  const props = {
    color: d3.scaleOrdinal(d3.schemeCategory10),
    shape: d3.scaleOrdinal(d3.symbols),
    svg: d3.select('#area')
      .attr('stroke', '#fff')
      .attr('stroke-width', '1.5'),
    startAngle: Math.PI / 4,
    get point3d() {
      const point3d = _3d()
        .x((d) => d.x)
        .y((d) => d.y)
        .z((d) => d.z)
        .rotateY(this.startAngle)
        .rotateX(-this.startAngle);
      return point3d;
    },
    data,
  };
  props.width = props.svg.node().getBoundingClientRect().width;
  props.height = props.svg.node().getBoundingClientRect().height;

  props.data.points = props.point3d(props.data.points);

  props.svg = props.svg
    .call(drag(props))
    .append('g');

  processData(props);
}
export default umap;
