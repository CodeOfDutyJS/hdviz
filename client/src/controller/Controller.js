/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
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

    // Set data al modello
    const _data = await parseFile(file);
    // this.model.reset();
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

    const forceFieldModel = new ForceFieldModel(this.model);
    // const scatterPlotMatrixModel = new ScatterPlotMatrixModel(this.model);
    // scatterPlotMatrix(scatterPlotMatrixModel.getPreparedDataSet(),
    //  this.model.feature,
    //  this.model.target);
    forceField(forceFieldModel
      .getPreparedDataset(distance[this.distanceSelected], 150, 150));
  }
}

export default Controller;
