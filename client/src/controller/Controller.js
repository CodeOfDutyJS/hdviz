/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable max-classes-per-file */
import { makeAutoObservable } from 'mobx';
import Papa from 'papaparse';
import * as d3 from 'd3';
import { distance } from 'ml-distance';
import forceField from '../model/d3/ForceField';
import scatterPlotMatrix from '../model/d3/ScatterPlotMatrix';
import DataModel from '../model/DataModel';
import ForceFieldModel from '../model/ForceFieldModel';
import ScatterPlotMatrixModel from '../model/ScatterPlotMatrixModel';
import LinearProjectionModel from '../model/LinearProjectionModel';
import HeatMapModel from '../model/HeatMapModel';
import { DistanceType, ClusteringType } from '../utils';

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

  da;

  clusterCol = [];

  loadingCompleted = false;

  // parti = false;

  constructor() {
    makeAutoObservable(this);
    this.model = new DataModel();
  }

  setFeatures(_features) {
    this.featuresSelected = _features;
    this.model.feature = this.featuresSelected;
  }

  setTarget(_target) {
    this.targetSelected = _target;
    this.model.target = this.targetSelected;
  }

  setDistance(_distance) {
    this.distanceSelected = _distance;

    // if (this.distanceSelected === DistanceType.EUCLIDEAN) {
    //   this.model.setEuclideanDistance(12);
    // }
  }

  setVisualization(_visualization) {
    this.visualizationSelected = _visualization;
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
    this.featureSelected = null;
    this.targetSelected = null;

    this.changed = !this.changed;

    const _data = await getData(db_, table_);
    this.model.dataset = _data;
    this.columns = Object.keys(_data.rows[0]);

    this.loadingCompleted = await this.model.dataset != null;
  }

  async uploadCSV(file) {
    this.featureSelected = [];
    this.targetSelected = [];

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

    // Set data to model
    const _data = await parseFile(file);
    this.model.dataset = _data;

    // Set columns
    this.columns = Object.keys(_data[0]);

    // eslint-disable-next-line max-len
    // this.model.setSelectedColumns(['housing_median_age', 'total_rooms', 'total_bedrooms', 'population', 'households', 'median_income', 'median_house_value']);

    // this.model.calculateDistance();

    // await this.model.calculateDistance();
    // this.model.setId('progressive');
    // console.log(await this.model.getSelectedData());

    // Set loadingCompleted
    this.loadingCompleted = await this.model.dataset != null;
  }

  // eslint-disable-next-line class-methods-use-this
  removeGraph() {
    const svg = d3.select('#area');
    svg.selectAll('circle').remove();
    svg.selectAll('line').remove();
  }

  async start() {
    this.removeGraph();
    this.model.feature = this.featuresSelected;
    this.model.target = this.targetSelected;
    // this.model.setFeatures(this.featuresSelected);

    if (this.distanceSelected === DistanceType.EUCLIDEAN) {
      const heatmap = new HeatMapModel(this.model);
      this.da = heatmap.getClustering(ClusteringType.SIMPLE, DistanceType.PEARSONS);
      const c = heatmap.getClustering(ClusteringType.SIMPLE, DistanceType.PEARSONS);
      HeatMapModel.getLeaves(c).forEach((leaf) => {
        console.log(leaf);
        this.clusterCol.push(leaf.id);
      });
      // this.model.setEuclideanDistance(400);
    }
    this.dendogram();
    this.correlationHeatmap();
  }

  correlationHeatmap() {
    const cols = [];
    HeatMapModel.getLeaves(this.da)
      .forEach((leaf) => cols.push(leaf.id));
    const grid = HeatMapModel.correlationMap(this.da);
    this.da = grid;
    const rows = d3.max(grid, (d) => d.row);
    const width = 600 || svg.node().getBoundingClientRect().width;
    const height = 600 || svg.node().getBoundingClientRect().height;
    const margin = {
      top: 20,
      bottom: 20,
      left: 100,
      right: 20,
    };
    const svg = d3.select('#area');
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
      .range(['white', '#ff1a00'])
      .domain([-1, 1]);

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
  }

  heatmap() {
    const cols = this.clusterCol;
    const grid = HeatMapModel.dataGrid(this.da, cols);
    this.da = grid;
    const rows = d3.max(grid, (d) => d.row);
    const width = 600 || svg.node().getBoundingClientRect().width;
    const height = 600 || svg.node().getBoundingClientRect().height;
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

  // eslint-disable-next-line class-methods-use-this
  dendogram() {
    const svg = d3.select('#area');
    const Cluster = d3.cluster()
      .size([600, 100]);
    const root = d3.hierarchy(this.da, (d) => d.children);
    Cluster(root);
    svg.selectAll('path')
      .data(root.descendants().slice(1))
      .enter()
      .append('path')
      // eslint-disable-next-line prefer-template
      .attr('d', (d) => 'M' + d.y + ',' + d.x
                  + 'C' + (d.parent.y + 0) + ',' + d.x
                  + ' ' + (d.parent.y + 0) + ',' + d.parent.x // 50 and 150 are coordinates of inflexion, play with it to change links shape
                  + ' ' + d.parent.y + ',' + d.parent.x)
      .style('fill', 'none')
      .attr('transform', '0, 20')
      .attr('stroke', '#ccc');
    // nodes are ugly
    svg.selectAll('g')
      .data(root.descendants())
      .enter()
      .append('g')
      // eslint-disable-next-line prefer-template
      .attr('transform', (d) => 'translate(' + d.y + ',' + d.x + ')')
      .append('circle')
      .attr('r', 2)
      .attr('opacity', (d) => (d.children ? 1 : 0))
      .style('fill', '#fff')
      .attr('stroke', 'black')
      .attr('transform', '0, 20')
      .style('stroke-width', 2);
  }
}

export default Controller;
