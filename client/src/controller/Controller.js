/* eslint-disable max-classes-per-file */
import Paragraph from 'antd/lib/skeleton/Paragraph';
import {
  makeAutoObservable, makeObservable, observable, computed, action,
} from 'mobx';
import Papa from 'papaparse';
import VisualizationType, { DistanceType } from '../utils';

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

  setFeatures(_features) {
    this.featuresSelected = _features;
    this.model.setSelectedColumns(this.featuresSelected);
  }

  setTarget(_target) {
    this.targetSelected = _target;

    this.model.ciao(this.targetSelected);
  }

  setDistance(_distance) {
    this.distanceSelected = _distance;

    if (this.distanceSelected === DistanceType.EUCLIDEAN) {
      this.model.setEuclideanDistance(12, 12);
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
    // this.model.setData(_data);
    this.data = _data;

    // Set columns
    this.columns = Object.keys(_data[0]);

    // Set loadingCompleted
    this.loadingCompleted = this.data != null;
  }

  // eslint-disable-next-line class-methods-use-this
  getVisualization() {
    return 'Visualization';
  }
}

export default Controller;
