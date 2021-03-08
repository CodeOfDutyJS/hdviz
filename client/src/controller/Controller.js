/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable max-classes-per-file */
import { makeAutoObservable } from 'mobx';
import Papa from 'papaparse';
import * as d3 from 'd3';
import Model from '../model/model';
import { DistanceType } from '../utils';

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
  }

  setTarget(_target) {
    this.targetSelected = _target;

    this.model.setTarget(this.targetSelected);
  }

  setDistance(_distance) {
    this.distanceSelected = _distance;

    // if (this.distanceSelected === DistanceType.EUCLIDEAN) {
    //   this.model.setEuclideanDistance(12);
    // }
  }

  setVisualization(_visualization) {
    this.visualizationSelected = _visualization;
    console.log(this.loadingData);
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

  async setData(db_, table_) {
    this.data = await getData(db_, table_);
  }

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

    // Set columns
    this.columns = Object.keys(_data[0]);
    // eslint-disable-next-line max-len
    // this.model.setSelectedColumns(['housing_median_age', 'total_rooms', 'total_bedrooms', 'population', 'households', 'median_income', 'median_house_value']);

    // this.model.calculateDistance();

    // await this.model.calculateDistance();
    // this.model.setId('progressive');
    // console.log(await this.model.getSelectedData());

    // Set loadingCompleted
    this.loadingCompleted = await this.model.data != null;
  }

  async start() {
    this.model.setSelectedColumns([...this.featuresSelected, ...this.targetSelected]);
    // this.model.setFeatures(this.featuresSelected);

    if (this.distanceSelected === DistanceType.EUCLIDEAN) {
      this.model.calculateDistance();
      // this.model.setEuclideanDistance(400);
      this.model.setId('progressive');
      console.log(await this.model.getSelectedData());
    }

    this.forceField();
  }

  forceField() {
    const drag = (simulation) => {
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      return d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended);
    };

    const colore = d3.scaleOrdinal(d3.schemeCategory10);
    colore.domain(['NEAR BAY', 'INLAND', 'ISLAND', 'NEAR OCEAN', '<1H OCEAN']);

    const verydata = this.model.getSelectedData();

    const links = verydata.links.map((d) => Object.create(d));
    const nodes = verydata.nodes.map((d) => Object.create(d));

    console.log(links);
    console.log(nodes);

    const svg = d3.select('#area');

    const width = 600 || svg.node().getBoundingClientRect().width;
    const height = 600 || svg.node().getBoundingClientRect().height;

    console.log(width);
    console.log(height);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(links).distance((d) => d.value * 1).strength((d) => (1 / (d.value * 1))).id((d) => d.id))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(width / 2, height / 2));

    // const link = svg.append('g')
    //   .attr('stroke', '#999')
    //   .attr('stroke-opacity', 0.6)
    //   .selectAll('line')
    //   .data(links)
    //   .join('line')
    //   .attr('stroke-width', (d) => Math.sqrt(d.value / 100));

    const node = svg.append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll('circle')
      .data(nodes)
      .join('circle')
      .attr('r', 5)
      .attr('fill', (d) => colore(d.colore))
      .call(drag(simulation));

    node.append('title')
      .text((d) => d.id);

    simulation.on('tick', () => {
      // link
      //   .attr('x1', (d) => d.source.x)
      //   .attr('y1', (d) => d.source.y)
      //   .attr('x2', (d) => d.target.x)
      //   .attr('y2', (d) => d.target.y);

      node
        .attr('cx', (d) => d.x)
        .attr('cy', (d) => d.y);
    });
  }
}

export default Controller;
