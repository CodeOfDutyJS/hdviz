/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
/* eslint-disable react/react-in-jsx-scope */
/* eslint-disable max-classes-per-file */
import { makeAutoObservable } from 'mobx';
import Papa from 'papaparse';
import * as d3 from 'd3';
import { distance } from 'ml-distance';
import forceField from '../model/d3/ForceField';
import DataModel from '../model/DataModel';
import ForceFieldModel from '../model/ForceFieldModel';

import { getDatabases, getTables, getData } from './API';

class Controller {
  model = null;
  visualizationSelected = null;
  columns = [];
  featuresSelected = [];
  targetSelected = [];
  distanceSelected = null;

  // Database stuff
  databases = [];
  databaseSelected = null;
  tables = [];
  tableSelected = null;

  loadingCompleted = false;
  success = false;

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
  }

  setVisualization(_visualization) {
    this.visualizationSelected = _visualization;
  }

  async setDatabases() {
    this.databases = await getDatabases();
  }

  async setTables(db_) {
    this.databaseSelected = db_;
    this.tables = await getTables(this.databaseSelected);
  }

  async setData(table_) {
    this.tableSelected = table_;

    this.featureSelected = null;
    this.targetSelected = null;

    this.changed = !this.changed;

    const _data = await getData(this.databaseSelected, this.tableSelected);
    this.model.dataset = _data;
    this.columns = Object.keys(_data.rows[0]);

    this.loadingCompleted = await this.model.dataset != null;
  }

  async uploadCSV(file) {
    this.featuresSelected = [];
    this.targetSelected = [];

    console.log(this.featureSelected);

    this.loadingCompleted = false;

    // Funzione per il parsing
    const parseFile = (rawFile) => new Promise((resolve) => {
      Papa.parse(rawFile, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        worker: true,
        complete: (results) => {
          resolve(results.data);
        },
      });
    });

    // Set data to model
    const _data = await parseFile(file);
    // this.model.reset();
    this.model.dataset = _data;

    console.log(_data);

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

    forceField(forceFieldModel
      .getPreparedDataset(distance[this.distanceSelected], 150, 150, true));
  }
}

export default Controller;
