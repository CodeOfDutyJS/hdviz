/* eslint-disable max-classes-per-file */
import Paragraph from 'antd/lib/skeleton/Paragraph';
import {
  makeAutoObservable, makeObservable, observable, computed, action,
} from 'mobx';
import Papa from 'papaparse';

import { getDatabases, getTables, getData } from './API';

class Model {
  title = '';

  constructor() {
    makeAutoObservable(this);
    this.title = 'fsafasfasfasfsa';
  }

  set Title(_title) {
    this.title = _title;
  }

  get Title() {
    return this.title;
  }
}

class Controller {
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

  constructor() {
    makeAutoObservable(this);
    this.visualization = new Model();
  }

  setColumnsFromModel() {
    // this.columns = model.qualcosa
    this.columns = ['col1', 'col2', 'col3', 'col4', 'col5', 'col6'];
  }

  setFeatures(_features) {
    this.featuresSelected = _features;
  }

  setTarget(_target) {
    this.targetSelected = _target;
  }

  setDistance(_distance) {
    this.distanceSelected = _distance;
  }

  setVisualization(_visualization) {
    this.visualizationSelected = _visualization;
    console.log(this.loadingData);
  }

  getVisualizationSelected() {
    return this.visualizationSelected;
  }

  getTitle() {
    return this.visualization.Title;
  }

  setTitle() {
    this.visualization.Title = 'https://mobx.js.org/defining-data-stores.html';
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
  async testCSV(file) {
    // Papa.parsePromise(file)
    //   .then((results) => { this.data = results; this.loadingData = true; });
    // this.data = Papa.parse(file, {
    //   header: true,
    //   dynamicTyping: true,
    //   worker: true,
    //   complete: (r) => {
    //     console.log(r);
    //   },
    // });

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
    this.data = await parseFile(file);
    this.loadingCompleted = this.data != null;
    // console.log('parsedData', parsedData);
  }
}

Papa.parsePromise = function (file) {
  return new Promise((complete, error) => {
    Papa.parse(file, {
      header: true, dynamicTyping: true, worker: true, complete, error,
    });
  });
};

export default Controller;
