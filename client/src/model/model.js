/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
import * as d3 from 'd3';
import * as mldistance from 'ml-distance';
import Dataset from './Dataset';
import useD3 from '../ui/hooks/useD3';

class Model {
  data = new Dataset();

  selectedData = new Dataset();

  label = {
    id: 'none',
    target: [],
    features: [],
  }

  selectedColumns = [];

  addProgressiveId() {
    for (let i = 0; i < this.selectedData.getData().nodes.length; i++) {
      const n = this.selectedData.getData().nodes[i];
      n.id = `node_${i}`;
    }
  }

  renameId() {
    for (let i = 0; i < this.selectedData.getData().nodes.length; i++) {
      const n = this.selectedData.getData().nodes[i];
      n.id = n[this.label.id];
      delete n[this.label.id];
    }
  }

  setId(a) {
    if (a === this.label.id || a === 'null' || a === 'undefined') return;
    this.label.id = a;
    if (this.label.id === 'progressive') {
      this.addProgressiveId();
    } else this.renameId();
  }

  setSelectedColumns(a) {
    if (a === this.selectedColumns) return;
    if (a == null) return;
    this.selectedColumns.length = 0;
    a.forEach(
      (ele) => this.selectedColumns.push(ele),
    );
    this.data.getData().nodes.forEach((row) => {
      Dataset.columnSelect(row, this.selectedColumns, (r) => {
        this.selectedData.addRow(r);
      });
    });
  }

  setFeatures(a) {
    this.label.features = a;
  }

  getFeatures() {
    return (this.label.features.slice());
  }

  setTarget(a) {
    this.label.target = a;
  }

  getTarget() {
    return (this.label.target.slice());
  }

  getSelectedColumns() {
    return this.selectedColumns.slice();
  }

  getSelectedData() {
    return this.selectedData.getData();
  }

  getLabel() {
    return Object.create(this.label);
  }

  async setEuclideanDistance(numberOfNodes, minDistance = 0) {
    this.selectedData.getData().links = [];
    for (let i = 0; i < numberOfNodes; i++) {
      for (let z = 1 + i; z < numberOfNodes; z++) {
        let m = 0;
        const obj1 = this.selectedData.getData().nodes[i];
        const obj2 = this.selectedData.getData().nodes[z];
        this.label.features.forEach((key) => {
          m += (obj1[key] - obj2[key]) ** 2;
        });
        m = Math.sqrt(m);
        if (m >= minDistance) {
          this.selectedData.getData().links.push(
            {
              source: obj1.id,
              target: obj2.id,
              distance: m,
            },
          );
        }
      }
    }
    this.selectedData.getData().nodes.length = numberOfNodes;
  }

  calculateDistance() {
    this.selectedData.getData().links = [];
    for (let i = 0; i < 400; i++) {
      for (let j = 1 + i; j < 400; j++) {
        const distance = mldistance.distance.manhattan(
          Object.values(this.selectedData.getData().nodes[i]),
          Object.values(this.selectedData.getData().nodes[j]),
        );
        if (distance / 1000 > 1) {
          this.selectedData.getData().links.push(
            {
              source: `node_${i}`,
              target: `node_${j}`,
              value: distance / 1000,
            },
          );
        }
      }
    }

    this.selectedData.getData().nodes.length = 400;
  }

  setData(a) {
    this.reset();
    this.data.getData().nodes = a;
  }

  getData() {
    return this.data.getData();
  }

  reset() {
    this.data.dataFlush();
    this.selectedData.dataFlush();
  }

  getForceField() {
    const ffvisual = useD3((svg) => {
      const { nodes } = this.getSelectedData();
      const { links } = this.getSelectedData();

      const simulation = d3.forceSimulation(nodes)
        .force('charge', d3.forceManyBody().strength(-100))
        .force('link', d3.forceLink(links).id((d) => d.id).strength((d) => d.value))
        .force('center ', d3.forceCenter(300, 300))
        .on('tick', () => {
          node
            .attr('cx', (d) => d.x)
            .attr('cy', (d) => d.y);

          link
            .attr('x1', (d) => d.source.x)
            .attr('y1', (d) => d.source.y)
            .attr('x2', (d) => d.target.x)
            .attr('y2', (d) => d.target.y);
        });

      const link = svg.select('.lines')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .selectAll('line')
        .data(links)
        .join('line')
        .attr('stroke-width', (d) => d.value);

      const node = svg.select('.circles')
        .attr('stroke', '#fff')
        .attr('stroke-width', 1.5)
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', 5)
        .attr('fill', (d) => d3.schemeCategory10[d.group])
        .call(d3.drag(simulation).on('start', (event) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        })
          .on('drag', (event) => {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
          })
          .on('end', (event) => {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
          }));

      const label = node.append('title')
        .text((d) => d.label);
    });

    return (
      <svg
        ref={ffvisual}
        style={{
          height: 600,
          width: '100%',
          marginRight: '0px',
          marginLeft: '0px',
        }}
      >
        <g className="lines" />
        <g className="circles" />
      </svg>
    );
  }
}

/*
  class Model{
    constructor() {
      throw new Error('Use Model.getInstance()');
  }
  static getInstance() {
      if (!Model.instance) {
          Model.instance = new PrivateModel();
      }
      return Model.instance;
  }
  }
*/

export default Model;
