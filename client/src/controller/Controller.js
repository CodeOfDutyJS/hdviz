/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable max-classes-per-file */
import { makeAutoObservable } from 'mobx';
import Papa from 'papaparse';
import * as d3 from 'd3';
import Model from '../model/model';
import { DistanceType } from '../utils';
import useD3 from '../ui/hooks/useD3';

import { getDatabases, getTables, getData } from './API';

class Controller {
  model = null;

  visualizationSelected = null;

  columns = [];

  featuresSelected = [];

  targetSelected = [];

  distanceSelected = null;

  visualization = null;

  databases = [];

  tables = [];

  data;

  loadingCompleted = false;

  parti = false;

  constructor() {
    makeAutoObservable(this);
    this.model = new Model();
  }

  setFeatures(_features) {
    this.featuresSelected = _features;
    this.model.setSelectedColumns(this.featuresSelected);
    this.model.setFeatures(this.featuresSelected);
  }

  setTarget(_target) {
    this.targetSelected = _target;

    this.model.setTarget(this.targetSelected);
  }

  setDistance(_distance) {
    this.distanceSelected = _distance;

    if (this.distanceSelected === DistanceType.EUCLIDEAN) {
      this.model.setEuclideanDistance(12);
    }
  }

  setVisualization(_visualization) {
    this.visualizationSelected = _visualization;
    console.log(this.loadingData);
  }

  getVisualizationSelected() {
    return this.visualizationSelected;
  }

  async setDatabases() {
    this.databases = await getDatabases();
  }

  async getDatabases() {
    await this.setDatabases();
    return this.databases;
  }

  async setTables(db_) {
    this.tables = await getTables(db_);
  }

  async getTables(db_) {
    await this.setTables(db_);
    return this.tables;
  }

  async setData(table_) {
    this.data = await getData(table_);
  }

  getData() {
    return this.data;
  }

  // eslint-disable-next-line class-methods-use-this
  async uploadCSV(file) {
    this.loadingCompleted = false;
    // Funzione per il parsing
    const parseFile = (rawFile) => new Promise((resolve) => {
      Papa.parse(rawFile, {
        header: true,
        dynamicTyping: true,
        worker: true,
        complete: (results) => {
          resolve(results.data);
        },
      });
    });

    // Set data al modello
    const _data = await parseFile(file);
    this.model.setData(_data);
    // this.data = _data;
    console.log(this.model.getData());
    console.log(this.model.getSelectedData());

    // Set columns
    this.columns = Object.keys(_data[0]);
    this.model.setSelectedColumns(['housing_median_age', 'total_rooms', 'population']);
    this.model.setId('progressive');
    await this.model.setEuclideanDistance(12, 0);
    console.log(this.model.getSelectedData());

    // Set loadingCompleted
    this.loadingCompleted = this.model.data != null;
  }

  // eslint-disable-next-line class-methods-use-this
  getForceField() {
    const ffvisual = useD3((svg) => {
      const { nodes } = this.model.getSelectedData();
      const { links } = this.model.getSelectedData();

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
        .attr('fill', (d) => d3.schemeCategory10[d.group]);
        // .call(d3.drag(simulation).on('start', (event) => {
        //   if (!event.active) simulation.alphaTarget(0.3).restart();
        //   event.subject.fx = event.x;
        //   event.subject.fy = event.y;
        // })
        //   .on('drag', (event) => {
        //     event.subject.fx = event.x;
        //     event.subject.fy = event.y;
        //   })
        //   .on('end', (event) => {
        //     if (!event.active) simulation.alphaTarget(0);
        //     event.subject.fx = null;
        //     event.subject.fy = null;
        //   }));

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

export default Controller;
